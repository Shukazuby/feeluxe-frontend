'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      const adminData = localStorage.getItem('admin');
      
      if (token && adminData) {
        // Admin is authenticated, redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        // Admin is not authenticated, redirect to login
        router.push('/admin/login');
      }
    }
  }, [router]);

  // Show loading state while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
  );
}

