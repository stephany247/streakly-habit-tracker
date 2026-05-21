'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
}