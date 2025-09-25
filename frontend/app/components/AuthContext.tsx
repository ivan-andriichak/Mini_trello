'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { login as apiLogin, logout as apiLogout, register as apiRegister } from '../lib/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; name: string }) => Promise<User | null>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/auth/me`, {
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    void checkAuth();
  }, []);

  const register = async (data: { email: string; password: string; name: string }) => {
    const response = await apiRegister(data);
    setUser(response.user);
    return response.user;
  };

  const login = async (data: { email: string; password: string }) => {
    const response = await apiLogin(data);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};