const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export class ApiError extends Error {
  constructor(public status: number, public message: string, public errors?: any) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("sadam_token") : null;
  
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If body is FormData, do not set Content-Type (browser will set it with boundary)
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, data.message || "Terjadi kesalahan", data.errors);
  }

  return data;
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => fetchApi(endpoint, { ...options, method: "GET" }),
  post: (endpoint: string, body: any, options?: RequestInit) => 
    fetchApi(endpoint, { ...options, method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (endpoint: string, body: any, options?: RequestInit) => 
    fetchApi(endpoint, { ...options, method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: (endpoint: string, body: any, options?: RequestInit) => 
    fetchApi(endpoint, { ...options, method: "PATCH", body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: (endpoint: string, options?: RequestInit) => fetchApi(endpoint, { ...options, method: "DELETE" }),
};
