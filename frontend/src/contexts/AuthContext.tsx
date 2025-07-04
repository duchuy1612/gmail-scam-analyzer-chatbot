import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, User, AuthResponse } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const token = apiClient.getToken();
      const refresh = apiClient.getRefreshToken();
      if (!token && !refresh) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await apiClient.getCurrentUser();
        setUser(me);
try {
        const me = await apiClient.getCurrentUser();
        setUser(me);
      } catch (err: Error) {
        if (err instanceof Error && 'status' in err && err.status === 401 && refresh) {
          try {
            await apiClient.refreshToken();
            const me = await apiClient.getCurrentUser();
        if (err.status === 401 && refresh) {
          try {
            await apiClient.refreshToken();
            const me = await apiClient.getCurrentUser();
            setUser(me);
          } catch {
            apiClient.clearToken();
            apiClient.clearRefreshToken();
            setUser(null);
          }
        } else {
          apiClient.clearToken();
          apiClient.clearRefreshToken();
        }
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      const response: AuthResponse = await apiClient.login(email, password);
      setUser(response.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      const response: AuthResponse = await apiClient.register(email, password, name);
      setUser(response.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    apiClient.clearToken();
    apiClient.clearRefreshToken();
    setUser(null);
    setError(null);
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
