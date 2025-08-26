import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helpers for token handling
function getAccessToken(): string | null {
  return (
    sessionStorage.getItem('access_token') ||
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('accessToken') ||
    localStorage.getItem('accessToken')
  );
}

function getRefreshTokenAndStorage(): { token: string | null; storage: Storage | null } {
  if (sessionStorage.getItem('refresh_token') || sessionStorage.getItem('refreshToken')) {
    return {
      token: sessionStorage.getItem('refresh_token') || sessionStorage.getItem('refreshToken'),
      storage: sessionStorage,
    };
  }
  if (localStorage.getItem('refresh_token') || localStorage.getItem('refreshToken')) {
    return {
      token: localStorage.getItem('refresh_token') || localStorage.getItem('refreshToken'),
      storage: localStorage,
    };
  }
  return { token: null, storage: null };
}

function setAccessTokenIn(storage: Storage, token: string) {
  storage.setItem('access_token', token);
  storage.setItem('accessToken', token);
}

function clearAllAuthStorage() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem('access_token');
    storage.removeItem('refresh_token');
    storage.removeItem('accessToken');
    storage.removeItem('refreshToken');
    storage.removeItem('user');
    storage.removeItem('userProfile');
    storage.removeItem('isLoggedIn');
    storage.removeItem('userRole');
  }
}

let isRefreshing = false as boolean;
let refreshPromise: Promise<string> | null = null;

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest?.url?.endsWith('/auth/refresh')) {
      originalRequest._retry = true;
      try {
        // Ensure only one refresh runs
        if (!isRefreshing) {
          isRefreshing = true;
          const { token: rt, storage } = getRefreshTokenAndStorage();
          if (!rt || !storage) {
            throw new Error('No refresh token');
          }
          refreshPromise = api
            .post('/auth/refresh', { refresh_token: rt })
            .then((res) => {
              const newAccess = res?.data?.access_token as string | undefined;
              if (!newAccess) throw new Error('No access_token in refresh response');
              setAccessTokenIn(storage, newAccess);
              return newAccess;
            })
            .finally(() => {
              isRefreshing = false;
            });
        }
        const newToken = await (refreshPromise as Promise<string>);
        // Retry original request with new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (_e) {
        clearAllAuthStorage();
        const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole') || '';
        const authPath = role ? `/auth?role=${role}` : '/auth';
        window.location.href = authPath;
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string; role?: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateAvatar: (formData: FormData) =>
    api.put('/auth/avatar', formData),
};

// Content API
export const contentAPI = {
  create: (formData: FormData) =>
    api.post('/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  getMyContents: () =>
    api.get('/content/my'),

  getById: (id: string) =>
    api.get(`/content/${id}`),
  
  update: (id: string, data: any) =>
    api.put(`/content/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/content/${id}`),
  
  assignToBusiness: (id: string, businessId: string) =>
    api.put(`/content/${id}/assign`, { businessId }),
};

// Business API
export const businessAPI = {
  getAll: () =>
    api.get('/businesses'),
  
  create: (data: any) =>
    api.post('/businesses', data),
};

// Sales API
export const salesAPI = {
  getMySales: () =>
    api.get('/sales/my'),
  
  getContentSales: (contentId: string) =>
    api.get(`/sales/content/${contentId}`),
};

export default api;
