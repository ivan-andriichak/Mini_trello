'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import React, {useEffect, useState} from "react";
import {useAuth} from "./AuthContext";
import {Breadcrumbs} from "./ui/Breadcrumbs";
import {getBoard} from "../lib/api";

export default function NavBar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [boardTitle, setBoardTitle] = useState<string | undefined>(undefined);

  useEffect(() => {
    const match = pathname.match(/^\/boards\/(\d+)$/);
    if (match) {
      const boardId = Number(match[1]);
      getBoard(boardId)
        .then(board => setBoardTitle(board.title))
        .catch(() => setBoardTitle(undefined));
    } else {
      setBoardTitle(undefined);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/' && pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
    }
  }, [isLoading, user, pathname, router]);

  return (
    <nav className="bg-neutral-700 text-white p-3 sm:p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/"
            className={`text-xl font-bold ${pathname === '/login' || pathname === '/register' ? 'pointer-events-none opacity-50' : ''}`}
            aria-disabled={pathname === '/login' || pathname === '/register'}
            tabIndex={pathname === '/login' || pathname === '/register' ? -1 : 0}
          >
            Mini-Trello
          </Link>
          <Breadcrumbs boardTitle={boardTitle}/>
        </div>
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              <span className="inline-flex-block mr-2 sm:mr-8 flex items-center text-sm sm:text-base">
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
                className="p-1 hover:text-red-500 hover:bg-neutral-600 flex align-text-center"
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