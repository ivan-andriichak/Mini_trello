'use client';

import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import { register as apiRegister, login as apiLogin, logout as apiLogout } from '../lib/api';
import {User} from '../types';

interface AuthContextType {
  user: User | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; name: string; surname: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/me', { credentials: 'include' });
        if (res.ok) {
          setUser(await res.json());
        }
      } catch (e) {
        console.error(e);
      }
    };
    void fetchUser();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    await apiLogin(data);
    const userResponse = await apiLogin(data);
    setUser(userResponse.user);
  };

  const register = async (data: { email: string; password: string; name: string; surname: string }) => {
    await apiRegister(data);
    const userResponse = await apiRegister(data);
    setUser(userResponse.user);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
