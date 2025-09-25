'use client';

import { AuthProvider } from './components/AuthContext';
import NavBar from './components/NavBar';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NavBar />
      <main className="max-w-7xl mx-auto sm:px-4 px-1 py-2 min-h-screen">
        {children}
      </main>
    </AuthProvider>
  );
}