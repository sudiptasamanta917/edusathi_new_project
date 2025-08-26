import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roles?: string[];
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean, role?: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      try {
        // Prefer snake_case tokens. Check sessionStorage first, then localStorage.
        const token =
          sessionStorage.getItem('access_token') ||
          localStorage.getItem('access_token') ||
          sessionStorage.getItem('accessToken') ||
          localStorage.getItem('accessToken');
        const savedUser =
          sessionStorage.getItem('user') ||
          localStorage.getItem('user') ||
          sessionStorage.getItem('userProfile') ||
          localStorage.getItem('userProfile');
        
        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
          // Optionally verify token with backend
          await authAPI.getProfile();
        }
      } catch (error) {
        // Token invalid, clear both storages
        for (const storage of [localStorage, sessionStorage]) {
          storage.removeItem('access_token');
          storage.removeItem('refresh_token');
          storage.removeItem('accessToken');
          storage.removeItem('refreshToken');
          storage.removeItem('user');
          storage.removeItem('userProfile');
          storage.removeItem('isLoggedIn');
          storage.removeItem('userRole');
          // Business-specific
          storage.removeItem('businessTemplate');
          storage.removeItem('businessAvatarUrl');
          storage.removeItem('planPurchased');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, remember: boolean = false, role?: string) => {
    try {
      const response = await authAPI.login({ email, password, role });
      const { user: userData, access_token, refresh_token } = response.data;

      const primary = remember ? localStorage : sessionStorage;
      const secondary = remember ? sessionStorage : localStorage;
      // Clear secondary to avoid conflicts
      for (const storage of [secondary]) {
        storage.removeItem('access_token');
        storage.removeItem('refresh_token');
        storage.removeItem('accessToken');
        storage.removeItem('refreshToken');
        storage.removeItem('user');
        storage.removeItem('userProfile');
        storage.removeItem('isLoggedIn');
        storage.removeItem('userRole');
        // Business-specific
        storage.removeItem('businessTemplate');
        storage.removeItem('businessAvatarUrl');
        storage.removeItem('planPurchased');
      }
      // Also clear any business-specific keys from both storages before starting a fresh session
      for (const storage of [localStorage, sessionStorage]) {
        storage.removeItem('businessTemplate');
        storage.removeItem('businessAvatarUrl');
        storage.removeItem('planPurchased');
      }
      // Store tokens/user in chosen storage
      if (access_token) primary.setItem('access_token', access_token);
      if (refresh_token) primary.setItem('refresh_token', refresh_token);
      if (access_token) primary.setItem('accessToken', access_token);
      if (refresh_token) primary.setItem('refreshToken', refresh_token);
      primary.setItem('user', JSON.stringify(userData));
      primary.setItem('userProfile', JSON.stringify(userData));
      primary.setItem('isLoggedIn', 'true');
      if (userData?.role) primary.setItem('userRole', userData.role);
      
      setUser(userData);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'creator', remember: boolean = false) => {
    try {
      const response = await authAPI.register({ name, email, password, role });
      const { user: userData, access_token, refresh_token } = response.data;

      const primary = remember ? localStorage : sessionStorage;
      const secondary = remember ? sessionStorage : localStorage;
      for (const storage of [secondary]) {
        storage.removeItem('access_token');
        storage.removeItem('refresh_token');
        storage.removeItem('accessToken');
        storage.removeItem('refreshToken');
        storage.removeItem('user');
        storage.removeItem('userProfile');
        storage.removeItem('isLoggedIn');
        storage.removeItem('userRole');
        // Business-specific
        storage.removeItem('businessTemplate');
        storage.removeItem('businessAvatarUrl');
        storage.removeItem('planPurchased');
      }
      // Also clear any business-specific keys from both storages before starting a fresh session
      for (const storage of [localStorage, sessionStorage]) {
        storage.removeItem('businessTemplate');
        storage.removeItem('businessAvatarUrl');
        storage.removeItem('planPurchased');
      }
      if (access_token) primary.setItem('access_token', access_token);
      if (refresh_token) primary.setItem('refresh_token', refresh_token);
      if (access_token) primary.setItem('accessToken', access_token);
      if (refresh_token) primary.setItem('refreshToken', refresh_token);
      primary.setItem('user', JSON.stringify(userData));
      primary.setItem('userProfile', JSON.stringify(userData));
      primary.setItem('isLoggedIn', 'true');
      if (userData?.role) primary.setItem('userRole', userData.role);
      
      setUser(userData);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Registration failed');
    }
  };

  const logout = () => {
    for (const storage of [localStorage, sessionStorage]) {
      storage.removeItem('access_token');
      storage.removeItem('refresh_token');
      storage.removeItem('accessToken');
      storage.removeItem('refreshToken');
      storage.removeItem('user');
      storage.removeItem('userProfile');
      storage.removeItem('isLoggedIn');
      storage.removeItem('userRole');
      // Business-specific
      storage.removeItem('businessTemplate');
      storage.removeItem('businessAvatarUrl');
      storage.removeItem('planPurchased');
    }
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      const userData = res.data?.user;
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (_e) {
      // ignore
    }
  };

  const updateAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    await authAPI.updateAvatar(formData);
    await refreshProfile();
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    refreshProfile,
    updateAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
