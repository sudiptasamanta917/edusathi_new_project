// Use environment-based API URL
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL ||
  (import.meta as any).env?.VITE_SERVER_URL ||
  "http://localhost:3001";

// Normalize origin (strip trailing slashes and a trailing '/api') so we can safely join paths
const API_BASE_ORIGIN = String(API_BASE_URL).replace(/\/+$/, '').replace(/\/api$/, '');

export const api = {
  baseURL: API_BASE_ORIGIN,
};

// Public export for consumers that need the origin (no trailing '/api')
export const API_BASE = API_BASE_ORIGIN;

// Build a full URL ensuring we have exactly one '/api' segment
function buildUrl(path: string): string {
  const base = API_BASE_ORIGIN;
  let p = path.startsWith('/') ? path : `/${path}`;
  const baseEndsWithApi = /\/api$/i.test(base);

  if (baseEndsWithApi && p.toLowerCase().startsWith('/api/')) {
    // Base already includes '/api', strip the duplicate from path
    p = p.slice(4);
  } else if (!baseEndsWithApi && !p.toLowerCase().startsWith('/api')) {
    // Base does not include '/api', ensure path does
    p = '/api' + p;
  }
  return `${base}${p}`;
}

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
  // Allow cookie-based refresh even if no stored token is present.
  const body = rt ? JSON.stringify({ refresh_token: rt }) : undefined;
  const res = await fetch(buildUrl('/api/auth/refresh'), {
    method: "POST",
    credentials: 'include',
    headers: { "Content-Type": "application/json" },
    body,
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

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  // Ensure cookies are sent (for cookie-based auth) unless explicitly overridden
  const finalInit: RequestInit = {
    credentials: 'include',
    ...init,
  };
  const res = await fetch(buildUrl(path), finalInit);
  if (res.status === 401 && retry) {
    try {
      await refreshAccessToken();
      const headers = new Headers(finalInit.headers as any);
      const token =
        sessionStorage.getItem("access_token") ||
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("accessToken") ||
        localStorage.getItem("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return request<T>(path, { ...finalInit, headers }, false);
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

  // Parse once
  const data = await res.json();

  // On successful login/register, clear any stale data so the next UI state is clean
  const method = (init?.method || 'GET').toUpperCase();
  const isAuthMutation = method === 'POST' && (
    path.startsWith('/api/auth/login') || path.startsWith('/api/auth/register')
  );
  if (isAuthMutation) {
    for (const storage of [localStorage, sessionStorage]) {
      storage.removeItem("access_token");
      storage.removeItem("refresh_token");
      storage.removeItem("accessToken");
      storage.removeItem("refreshToken");
      storage.removeItem("user");
      storage.removeItem("userProfile");
      storage.removeItem("isLoggedIn");
      storage.removeItem("userRole");
      // Admin notifications cache should not leak to non-admin/new users
      storage.removeItem('adminNotifications.lastSeenPurchaseAt');
      storage.removeItem('adminNotifications.clearedAt');
      storage.removeItem('adminNotifications.lastSeenTemplateAt');
      storage.removeItem('adminNotifications.templates.clearedAt');
      // Demo/basic login artifacts
      storage.removeItem('userEmail');
      // Business-specific
      storage.removeItem('planPurchased');
      storage.removeItem('businessTemplate');
      storage.removeItem('businessAvatarUrl');
      storage.removeItem('businessEmail');
      storage.removeItem('businessDomain');
      // Student-specific
      storage.removeItem('studentAvatarUrl');
    }
  }

  return data as T;
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
  myPurchases: () => apiGet<any>("/api/payment/purchases/my"),
};

export const StudentAPI = {
  // Old content system
  createOrder: (items: { contentId: string }[]) => apiPost<any>("/api/student/create-order", { items }),
  verify: (payload: any) => apiPost<any>("/api/student/verify", payload),
  myCourses: () => apiGet<any>("/api/student/my-courses"),
  
  // New course enrollment system
  courseCreateOrder: (courses: { courseId: string }[]) => apiPost<any>("/api/student/course/create-order", { courses }),
  courseVerify: (payload: any) => apiPost<any>("/api/student/course/verify", payload),
  enrollFreeCourse: (courseId: string) => apiPost<any>("/api/student/course/enroll-free", { courseId }),
  getEnrolledCourses: () => apiGet<any>("/api/student/enrolled-courses"),
  checkCourseAccess: (courseId: string) => apiGet<any>(`/api/student/course/${courseId}/access`),
  updateCourseProgress: (courseId: string, videoId: string) => apiPost<any>("/api/student/course/progress", { courseId, videoId }),
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
  google: (payload: { id_token: string; role?: string }) =>
    request<any>("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  getProfile: () => apiGet<any>("/api/auth/profile"),
  updateAvatar: (formData: FormData) => request<any>("/api/auth/avatar", {
    method: "PUT",
    headers: authHeaders(),
    body: formData,
  }),
  
  // Creator-specific auth
  creatorLogin: (payload: { email: string; password: string }) =>
    request<any>("/api/creator/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};

// Admin
export const AdminAPI = {
  roleStats: () => apiGet<any>("/api/admin/role-stats"),
  recentPurchases: (limit: number = 10) => apiGet<any>(`/api/admin/recent-purchases?limit=${encodeURIComponent(limit)}`),
  recentTemplateSelections: (limit: number = 10) => apiGet<any>(`/api/admin/recent-template-selections?limit=${encodeURIComponent(limit)}`),
  // Generic user listing by role (expects backend endpoint to return an array or { users: [] })
  listUsers: (role: string) => apiGet<any>(`/api/admin/users?role=${encodeURIComponent(role)}`),
};

// Content/Video API
export const ContentAPI = {
  getVideos: () => apiGet<any>("/api/creator/videos"),
  uploadVideo: (formData: FormData) => {
    const headers = authHeaders();
    // Don't set Content-Type for FormData - let browser set it with boundary
    return request<any>("/api/creator/videos/upload", {
      method: "POST",
      headers: headers,
      body: formData,
    });
  },
  getPublicVideos: () => apiGet<any>("/api/contents/videos"),
};

// course API...........
export const CourseAPI = {
  //  Get all creator courses
  getCourses: () => {
    const headers = authHeaders();
    return request<any>("/api/creator/courses", {
      method: "GET",
      headers,
    });
  },

  //  Create a new course (JSON + Token)
  createCourse: (body: any) => {
    const headers = {
      ...authHeaders(),
      "Content-Type": "application/json",
    };

    return request<any>("/api/creator/courses/create", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  },

  // Create playlist in a course
  createPlaylist: (courseId: string, body: any) => {
    const headers = {
      ...authHeaders(),
      "Content-Type": "application/json",
    };

    return request<any>(`/api/creator/courses/${courseId}/playlists`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  },

  // Get playlists for a course
  getPlaylists: (courseId: string) => {
    const headers = authHeaders();
    return request<any>(`/api/creator/courses/${courseId}/playlists`, {
      method: "GET",
      headers,
    });
  },

  // Add video to playlist
  addVideoToPlaylist: (courseId: string, playlistId: string, videoId: string) => {
    const headers = {
      ...authHeaders(),
      "Content-Type": "application/json",
    };

    return request<any>(`/api/creator/courses/${courseId}/playlists/${playlistId}/videos`, {
      method: "POST",
      headers,
      body: JSON.stringify({ videoId }),
    });
  },

  // Remove video from playlist
  removeVideoFromPlaylist: (courseId: string, playlistId: string, videoId: string) => {
    const headers = authHeaders();
    return request<any>(`/api/creator/courses/${courseId}/playlists/${playlistId}/videos/${videoId}`, {
      method: "DELETE",
      headers,
    });
  },

  // Update video order in playlist
  updateVideoOrder: (courseId: string, playlistId: string, videoOrder: string[]) => {
    const headers = {
      ...authHeaders(),
      "Content-Type": "application/json",
    };

    return request<any>(`/api/creator/courses/${courseId}/playlists/${playlistId}/videos/reorder`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ videoOrder }),
    });
  },
};


export const VideoAPI = ContentAPI;

// Public API for getting all courses
export const PublicAPI = {
  // Get all courses from all creators (public endpoint)
  getAllCourses: () => {
    return request<any>("/api/creator/public/courses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  // Get course by ID (public endpoint)
  getCourseById: (courseId: string) => {
    return request<any>(`/api/creator/public/courses/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
}; 
