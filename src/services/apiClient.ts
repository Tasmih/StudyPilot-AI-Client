const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export const apiClient = {
  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...customConfig } = options;
    const url = new URL(`${BASE_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const config: RequestInit = {
      ...customConfig,
      headers: {
        "Content-Type": "application/json",
        ...customConfig.headers,
      },
      // Essential for cross-origin Better Auth session cookie verification
      credentials: "include", 
    };

    try {
      const response = await fetch(url.toString(), config);
      
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw new ApiError(
          response.status,
          data.message || response.statusText || "An unexpected error occurred",
          data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      // Handle network errors (e.g. server down)
      throw new ApiError(0, error instanceof Error ? error.message : "Network error");
    }
  },

  get<T>(endpoint: string, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, body: any, options?: FetchOptions) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put<T>(endpoint: string, body: any, options?: FetchOptions) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  patch<T>(endpoint: string, body: any, options?: FetchOptions) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, method: "DELETE" });
  },
};
