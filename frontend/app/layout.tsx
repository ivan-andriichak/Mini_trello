import './globals.css';
import React from 'react';
import { Providers } from './providers';

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body className="bg-gray-50 min-h-screen">
    <Providers>{children}</Providers>
    </body>
    </html>
  );
}