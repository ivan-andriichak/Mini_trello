'use client'
import './globals.css';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import React, {useEffect} from "react";
import {AuthProvider, useAuth} from "./components/AuthContext";


function NavBar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
    }
  }, [isLoading, user, pathname, router]);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Mini-Trello</Link>
        <div className="space-x-4">
          {user ? (
            <>
              <span>Hello, {user.name}</span>
              <Link href="/boards" className={pathname === '/boards' ? 'underline' : ''}>
                Boards
              </Link>
              <button
                onClick={async () => { await logout(); router.push('/login'); }}
                className="bg-red-500 p-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={pathname === '/login' ? 'underline' : ''}>
                Login
              </Link>
              <Link href="/register" className={pathname === '/register' ? 'underline' : ''}>
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body>
    <AuthProvider>
      <NavBar />
      {children}
    </AuthProvider>
    </body>
    </html>
  );
}