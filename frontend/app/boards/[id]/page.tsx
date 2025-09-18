'use client';

import React, { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import Board from '../../components/Board';

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return null;
  }

  const boardId = Number(resolvedParams.id);

  return <Board boardId={boardId} />;
}