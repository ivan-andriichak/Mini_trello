'use client';

import React from 'react';

export default function Modal({
                                open,
                                title,
                                children,
                                onClose,
                              }: {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent transition-opacity duration-200">
      <div className="bg-neutral-100 rounded-xl p-6 min-w-[400px] drop-shadow-4xl shadow-2xl shadow-black/60 relative animate-fadeIn border border-gray-300">
        <button
          className="absolute right-2 top-2 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
        {children}
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.18s ease;
        }
      `}</style>
    </div>
  );
}