export const API_BASE =
  (import.meta as any).env?.VITE_API_URL ||
  (import.meta as any).env?.VITE_SERVER_URL ||
  "http://localhost:3001";

export function authHeaders(): Record<string, string> {
  const token =
    sessionStorage.getItem("access_token") ||
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshAccessToken() {
  const rt =
    sessionStorage.getItem("refresh_token") ||
    localStorage.getItem("refresh_token") ||
    sessionStorage.getItem("refreshToken") ||
    localStorage.getItem("refreshToken");
  if (!rt) throw new Error("No refresh_token");
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: rt }),
  });
  if (!res.ok) throw new Error("Refresh failed");
  const data = await res.json();
  if (data?.access_token) {
    // Persist refreshed access token to the same storage that holds the refresh token
    const target =
      sessionStorage.getItem("refresh_token") || sessionStorage.getItem("refreshToken")
        ? sessionStorage
        : localStorage;
    target.setItem("access_token", data.access_token);
    target.setItem("accessToken", data.access_token);
    return data.access_token as string;
  }
  throw new Error("No access_token in refresh response");
}

async function request<T>(path: string, init: RequestInit, retry = true): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (res.status === 401 && retry) {
    try {
      await refreshAccessToken();
      const headers = new Headers(init.headers as any);
      const token =
        sessionStorage.getItem("access_token") ||
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("accessToken") ||
        localStorage.getItem("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return request<T>(path, { ...init, headers }, false);
    } catch (e) {
      // clear tokens and bubble up
      for (const storage of [localStorage, sessionStorage]) {
        storage.removeItem("access_token");
        storage.removeItem("refresh_token");
        storage.removeItem("accessToken");
        storage.removeItem("refreshToken");
        storage.removeItem("user");
        storage.removeItem("userProfile");
        storage.removeItem("isLoggedIn");
        storage.removeItem("userRole");
      }
      throw new Error(await res.text());
    }
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...authHeaders() };
  return request<T>(path, { headers });
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...authHeaders() };
  return request<T>(path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

export async function apiPut<T>(path: string, body: any): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...authHeaders() };
  return request<T>(path, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
}

export async function apiDelete<T>(path: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...authHeaders() };
  return request<T>(path, {
    method: "DELETE",
    headers,
  });
}

// Domain-specific helpers to centralize endpoints
// Centers
export const CentersAPI = {
  list: () => apiGet<any>("/api/centers"),
  create: (body: any) => apiPost<any>("/api/centers", body),
  lookupByEmail: (email: string) => apiGet<any>(`/api/centers/lookup?email=${encodeURIComponent(email)}`),
  lookupByDomain: (domain: string) => apiGet<any>(`/api/centers/lookup?domain=${encodeURIComponent(domain)}`),
  setTemplate: (email: string, templateId: string) => apiPost<any>("/api/centers/template", { email, templateId }),
};

// Pricing
export const PricingAPI = {
  listPublic: () => apiGet<any>("/api/pricing"),
  listAdmin: () => apiGet<any>("/api/pricing/admin"),
  create: (plan: any) => apiPost<any>("/api/pricing", plan),
  update: (id: string, plan: any) => apiPut<any>(`/api/pricing/${id}`, plan),
  remove: (id: string) => apiDelete<any>(`/api/pricing/${id}`),
};

// Payment
export const PaymentAPI = {
  createOrder: (order: any) => apiPost<any>("/api/payment/create-order", order),
  getConfig: () => apiGet<any>("/api/payment/config"),
  verify: (payload: any) => apiPost<any>("/api/payment/verify", payload),
};

// Templates
export const TemplatesAPI = {
  apply: (templateId: string) => apiPost<any>("/api/templates/apply", { templateId }),
};

// Auth
export const AuthAPI = {
  login: (payload: { email: string; password: string; role?: string }) =>
    request<any>("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  register: (payload: { name: string; email: string; password: string; role?: string }) =>
    request<any>("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};
