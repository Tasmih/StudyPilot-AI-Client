const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface RequestOptions extends Omit<RequestInit, "body"> {
  data?: any;
}

/**
 * Generic request helper wrapping the native fetch API.
 * Configured with credentials: "include" to pass Better Auth cookies to the backend.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...restOptions } = options;
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const defaultHeaders: Record<string, string> = {};

  if (data && !(data instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  } as HeadersInit;

  const response = await fetch(url, {
    ...restOptions,
    headers: mergedHeaders,
    body: data && !(data instanceof FormData) ? JSON.stringify(data) : data,
    credentials: "include", // Required to pass Next.js session cookies to backend
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Fallback to generic status error if response is not JSON
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return response.text() as unknown as Promise<T>;
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
