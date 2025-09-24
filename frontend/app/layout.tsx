'use client'
import './globals.css';
import React from "react";
import {AuthProvider} from "./components/AuthContext";
import NavBar from "./components/NavBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className="bg-gray-50 min-h-screen">
    <AuthProvider>
      <main className="max-w-7xl mx-auto px-4">
      <NavBar />
        {children}
      </main>
    </AuthProvider>
    </body>
    </html>
  );
}