import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthAPI } from '../../Api/api';

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
  loginWithGoogle: (idToken: string, remember?: boolean, role?: string) => Promise<void>;
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
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          // Verify token with backend and sync the freshest user into the storage that holds the token
          try {
            const res = await AuthAPI.getProfile();
            const serverUser = res?.user || parsed;
            // Decide which storage currently owns the session (token source)
            const owningStorage =
              (sessionStorage.getItem('access_token') || sessionStorage.getItem('accessToken'))
                ? sessionStorage
                : localStorage;
            owningStorage.setItem('user', JSON.stringify(serverUser));
            owningStorage.setItem('userProfile', JSON.stringify(serverUser));
            if (serverUser?.role) owningStorage.setItem('userRole', serverUser.role);
            setUser(serverUser);
          } catch {
            // If profile fetch fails we fall back to parsed saved user; interceptor may handle refresh
          }
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
      const response = await AuthAPI.login({ email, password, role });
      const { user: userData, access_token, refresh_token } = response;

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
      console.error('Login error:', error);
      throw new Error(error?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'creator', remember: boolean = false) => {
    try {
      const response = await AuthAPI.register({ name, email, password, role });
      const { user: userData, access_token, refresh_token } = response;

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
      console.error('Registration error:', error);
      throw new Error(error?.message || 'Registration failed');
    }
  };

  const loginWithGoogle = async (idToken: string, remember: boolean = false, role?: string) => {
    try {
      const response = await AuthAPI.google({ id_token: idToken, role });
      const { user: userData, access_token, refresh_token } = response;

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
        storage.removeItem('businessTemplate');
        storage.removeItem('businessAvatarUrl');
        storage.removeItem('planPurchased');
      }
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
      console.error('Google login error:', error);
      throw new Error(error?.message || 'Google Sign-In failed');
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
      const res = await AuthAPI.getProfile();
      const userData = res?.user;
      if (userData) {
        // Write to the storage that currently holds the token
        const owningStorage =
          (sessionStorage.getItem('access_token') || sessionStorage.getItem('accessToken'))
            ? sessionStorage
            : localStorage;
        owningStorage.setItem('user', JSON.stringify(userData));
        owningStorage.setItem('userProfile', JSON.stringify(userData));
        if (userData?.role) owningStorage.setItem('userRole', userData.role);
        setUser(userData);
      }
    } catch (_e) {
      // ignore
    }
  };

  const updateAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    await AuthAPI.updateAvatar(formData);
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
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
