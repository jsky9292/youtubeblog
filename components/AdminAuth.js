// components/AdminAuth.js
// 관리자 인증 HOC (Higher Order Component)

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminAuth({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('adminToken');
    
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // children에 logout 함수 전달
  return (
    <>
      {typeof children === 'function' 
        ? children({ onLogout: handleLogout }) 
        : children}
    </>
  );
}
