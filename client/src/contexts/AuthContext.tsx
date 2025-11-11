'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  profile_picture?: string;
  date_of_birth?: string;
  is_verified: boolean;
  rating: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  // Get access token from localStorage
  const getAccessToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  // Get refresh token from localStorage
  const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  };

  // Set tokens in localStorage
  const setTokens = (access: string, refresh: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    }
  };

  // Remove tokens from localStorage
  const clearTokens = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  // Refresh access token
  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }
        return data.access;
      } else {
        clearTokens();
        return null;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      clearTokens();
      return null;
    }
  };

  // Fetch current user
  const fetchUser = async () => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 401) {
        // Try to refresh token
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry fetching user
          const retryResponse = await fetch(`${API_BASE_URL}/auth/me/`, {
            headers: {
              'Authorization': `Bearer ${newToken}`,
            },
          });
          if (retryResponse.ok) {
            const userData = await retryResponse.json();
            setUser(userData);
          } else {
            clearTokens();
            setUser(null);
          }
        } else {
          clearTokens();
          setUser(null);
        }
      } else {
        clearTokens();
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const url = `${API_BASE_URL}/auth/login/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      setTokens(data.access, data.refresh);
      await fetchUser();
      router.push('/listings');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      const url = `${API_BASE_URL}/auth/register/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error) || 'Registration failed');
      }

      const responseData = await response.json();
      setTokens(responseData.access, responseData.refresh);
      setUser(responseData.user);
      router.push('/listings');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    clearTokens();
    setUser(null);
    router.push('/');
  };

  // Refresh user data
  const refreshUser = async () => {
    await fetchUser();
  };

  // Load user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
