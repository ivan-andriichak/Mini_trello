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
    if (!isLoading && !user && pathname !== '/' && pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
    }
  }, [isLoading, user, pathname, router]);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
       <Link
          href="/"
          className={`text-xl font-bold ${pathname === '/login' || pathname === '/register' ? 'pointer-events-none opacity-50' : ''}`}
          aria-disabled={pathname === '/login' || pathname === '/register'}
          tabIndex={pathname === '/login' || pathname === '/register' ? -1 : 0}
        >
          Mini-Trello
        </Link>
        <div className="space-x-4 flex items-center">
          {user ? (
         <>
          <Link href="/boards" className={`inline-block mr-4 ${pathname === '/boards' ? 'underline text-red-500 hover:text-white' : ''}`}>
            Boards
          </Link>
            <span className="inline-flex-block mr-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 16-4 16 0" />
              </svg>
              {user.name}
            </span>
          <button
            onClick={async () => { await logout(); router.push('/login'); }}
            className="inline-block p-2 rounded-md hover:text-red-600"
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