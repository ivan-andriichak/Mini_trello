'use client'
import './globals.css';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import React, {useEffect} from "react";
import {AuthProvider, useAuth} from "./components/AuthContext";
import {Breadcrumbs} from "./components/ui/Breadcrumbs";


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
    <nav className="bg-neutral-700 text-white p-4 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6 ">
          <Link
          href="/"
          className={`text-xl font-bold ${pathname === '/login' || pathname === '/register' ? 'pointer-events-none opacity-50' : ''}`}
          aria-disabled={pathname === '/login' || pathname === '/register'}
          tabIndex={pathname === '/login' || pathname === '/register' ? -1 : 0}
        >
          Mini-Trello
        </Link>
          <hr/>
        <Breadcrumbs />
        </div>
        <div className="space-x-4 flex items-center">
          {user ? (
         <>
            <span className="inline-flex-block mr-8 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 16-4 16 0" />
              </svg>
              {user.name}
            </span>
           <button
             onClick={async () => {
               await logout();
               router.push('/login');
             }}
             className="p-1  hover:text-red-500 hover:bg-neutral-600 flex align-text-center "
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
             </svg>
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
    <body className="bg-gray-50 min-h-screen">
    <AuthProvider>
      <NavBar />
      <main className="max-w-7xl mx-auto px-4">
        {children}
      </main>
    </AuthProvider>
    </body>
    </html>
  );
}