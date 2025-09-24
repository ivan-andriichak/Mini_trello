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
      <main className="max-w-7xl mx-auto sm:px-4 px-1 py-2 min-h-screen">
      <NavBar />
        {children}
      </main>
    </AuthProvider>
    </body>
    </html>
  );
}