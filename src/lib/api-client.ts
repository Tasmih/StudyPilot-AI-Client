const isProduction = process.env.NODE_ENV === "production";
// Use same-origin proxy in production for cross-domain cookies; otherwise use direct URL
const API_URL = isProduction 
  ? "/proxy" 
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

export class ApiError extends Error {
  public status: number;
  public data?: any;
  public retryAfter?: number;
  public isRateLimit: boolean;

  constructor(message: string, status: number, data?: any, retryAfter?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.retryAfter = retryAfter;
    this.isRateLimit = status === 429;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  data?: any;
  retries?: number;
  retryDelayMs?: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generic request helper wrapping the native fetch API.
 * Configured with credentials: "include" to pass Better Auth cookies to the backend.
 * Includes automated exponential backoff retry for HTTP 429 rate limit responses.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, retries = 2, retryDelayMs = 1000, ...restOptions } = options;
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

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
    try {
      const response = await fetch(url, {
        ...restOptions,
        headers: mergedHeaders,
        body,
        credentials: "include", // Required to pass Next.js session cookies to backend
      });

      // Handle 429 Rate Limit with exponential backoff retry
      if (response.status === 429 && attempt < retries) {
        attempt++;
        const retryAfterHeader = response.headers.get("retry-after");
        let delayMs = retryDelayMs * Math.pow(2, attempt - 1) + Math.random() * 300;
        if (retryAfterHeader) {
          const parsedSeconds = parseInt(retryAfterHeader, 10);
          if (!isNaN(parsedSeconds) && parsedSeconds > 0) {
            delayMs = Math.max(delayMs, parsedSeconds * 1000);
          }
        }
        delayMs = Math.min(delayMs, 8000);
        console.warn(
          `[API Client] 429 Rate Limit received for ${path}. Retrying attempt ${attempt}/${retries} in ${Math.round(delayMs)}ms...`
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
          // Fallback to text if response is not JSON
          try {
            const errorText = await response.text();
            if (errorText && errorText.length < 200) {
              errorMessage = errorText;
            }
          } catch {
            // Keep generic status error
          }
        }

        if (response.status === 429) {
          errorMessage =
            errorMessage.includes("status: 429")
              ? "Too many requests. Please wait a moment and try again."
              : errorMessage;
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
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }

      if (attempt < retries && (err?.name === "TypeError" || err?.message?.includes("fetch"))) {
        attempt++;
        const delayMs = retryDelayMs * Math.pow(2, attempt - 1);
        await sleep(delayMs);
        continue;
      }

      throw err;
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
