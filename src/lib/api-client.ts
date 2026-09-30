const isProduction = process.env.NODE_ENV === "production";
// Use same-origin proxy in production for cross-domain cookies; otherwise use direct URL
const API_URL = isProduction 
  ? "/proxy" 
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

// Direct backend fallback URL (useful if reverse proxy / Edge gateway times out on cold boot)
const DIRECT_BACKEND_URL = "https://studypilot-ai-server.onrender.com";

export class ApiError extends Error {
  public status: number;
  public data?: any;
  public retryAfter?: number;
  public isRateLimit: boolean;
  public isTimeout: boolean;
  public isServerBusy: boolean;

  constructor(
    message: string,
    status: number,
    data?: any,
    retryAfter?: number,
    isTimeout: boolean = false
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.retryAfter = retryAfter;
    this.isRateLimit = status === 429;
    this.isTimeout = isTimeout || status === 408 || status === 504;
    this.isServerBusy = status === 429 || status === 503 || status === 502 || status === 504;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  data?: any;
  retries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generic request helper wrapping the native fetch API.
 * Configured with credentials: "include" to pass Better Auth cookies to the backend.
 * Includes automated request timeouts, AbortSignal cancellation, exponential backoff
 * for transient 429/502/503/504 errors, and direct origin fallback on proxy timeouts.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    data,
    headers,
    retries = 1,
    retryDelayMs = 1200,
    timeoutMs = 15000,
    signal: callerSignal,
    ...restOptions
  } = options;

  let url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const defaultHeaders: Record<string, string> = {};

  if (data && !(data instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  } as HeadersInit;

  const body = data && !(data instanceof FormData) ? JSON.stringify(data) : data;

  let attempt = 0;

  while (true) {
    // If caller's signal already aborted, exit immediately
    if (callerSignal?.aborted) {
      const abortErr = new Error("Request cancelled by caller");
      abortErr.name = "AbortError";
      throw abortErr;
    }

    // Set up per-attempt timeout controller coupled with caller's signal
    const controller = new AbortController();
    let isTimedOut = false;

    const onCallerAbort = () => {
      controller.abort(callerSignal?.reason || new Error("Request aborted"));
    };

    if (callerSignal) {
      callerSignal.addEventListener("abort", onCallerAbort, { once: true });
    }

    const timeoutId = setTimeout(() => {
      isTimedOut = true;
      controller.abort(new Error(`Request timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    try {
      let response: Response;
      try {
        response = await fetch(url, {
          ...restOptions,
          signal: controller.signal,
          headers: mergedHeaders,
          body,
          credentials: "include", // Required to pass Next.js session cookies to backend
        });
      } catch (fetchErr: any) {
        // If aborted because of client timeout
        if (isTimedOut) {
          if (attempt < retries && isProduction && url.startsWith("/proxy")) {
            attempt++;
            console.warn(`[API Client] Proxy timed out for ${path}. Retrying directly against backend origin...`);
            url = `${DIRECT_BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
            await sleep(600);
            continue;
          }
          throw new ApiError(
            "The request timed out. The server may be waking up, please click Retry.",
            408,
            null,
            undefined,
            true
          );
        }

        // If explicitly cancelled by user/caller, rethrow without retrying
        if (callerSignal?.aborted || fetchErr?.name === "AbortError") {
          const abortErr = new Error("Request cancelled");
          abortErr.name = "AbortError";
          throw abortErr;
        }

        // Network error / DNS failure
        if (attempt < retries) {
          attempt++;
          if (isProduction && url.startsWith("/proxy")) {
            url = `${DIRECT_BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
          }
          const delayMs = retryDelayMs * Math.pow(2, attempt - 1);
          await sleep(delayMs);
          continue;
        }

        throw new ApiError(
          fetchErr?.message || "Network connection error. Please check your internet or click Retry.",
          0
        );
      }

      // Handle transient 429, 502, 503, 504 errors with backoff retry
      const isTransientError =
        response.status === 429 ||
        response.status === 502 ||
        response.status === 503 ||
        response.status === 504;

      if (isTransientError && attempt < retries) {
        attempt++;
        if (isProduction && url.startsWith("/proxy") && (response.status === 502 || response.status === 504)) {
          url = `${DIRECT_BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
        }

        const retryAfterHeader = response.headers.get("retry-after");
        let delayMs = retryDelayMs * Math.pow(2, attempt - 1) + Math.random() * 300;
        if (retryAfterHeader) {
          const parsedSeconds = parseInt(retryAfterHeader, 10);
          if (!isNaN(parsedSeconds) && parsedSeconds > 0) {
            delayMs = Math.max(delayMs, parsedSeconds * 1000);
          } else {
            const dateVal = Date.parse(retryAfterHeader);
            if (!isNaN(dateVal) && dateVal > Date.now()) {
              delayMs = Math.max(delayMs, dateVal - Date.now());
            }
          }
        }
        delayMs = Math.min(delayMs, 8000);
        console.warn(
          `[API Client] HTTP ${response.status} for ${path}. Retrying attempt ${attempt}/${retries} in ${Math.round(delayMs)}ms...`
        );
        await sleep(delayMs);
        continue;
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorData: any = null;
        try {
          errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          try {
            const errorText = await response.text();
            if (errorText && errorText.length < 200) {
              errorMessage = errorText;
            }
          } catch {
            // Keep generic status error
          }
        }

        if (response.status === 429 || response.status === 503) {
          errorMessage =
            errorData?.message || "The server is temporarily busy. Please wait a moment and try again.";
        } else if (response.status === 504 || response.status === 502) {
          errorMessage =
            errorData?.message || "Server gateway timeout. The server took too long to respond. Please click Retry.";
        }

        const retryAfterSec = response.headers.get("retry-after")
          ? parseInt(response.headers.get("retry-after")!, 10)
          : undefined;

        throw new ApiError(errorMessage, response.status, errorData, retryAfterSec);
      }

      if (response.status === 204) {
        return {} as T;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json() as Promise<T>;
      }

      return response.text() as unknown as Promise<T>;
    } finally {
      clearTimeout(timeoutId);
      if (callerSignal) {
        callerSignal.removeEventListener("abort", onCallerAbort);
      }
    }
  }
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "data">) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, data?: any, options?: Omit<RequestOptions, "method" | "data">) =>
    request<T>(path, { ...options, method: "POST", data }),

  patch: <T>(path: string, data?: any, options?: Omit<RequestOptions, "method" | "data">) =>
    request<T>(path, { ...options, method: "PATCH", data }),

  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "data">) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
