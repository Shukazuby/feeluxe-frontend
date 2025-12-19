'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      const adminData = localStorage.getItem('admin');
      
      if (!token || !adminData) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        setLoading(false);
        return;
      }

      setAdmin(JSON.parse(adminData));
      setLoading(false);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '🛍️' },
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
    { href: '/admin/customers', label: 'Customers', icon: '👥' },
    { href: '/admin/newsletter', label: 'Newsletter', icon: '✉️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-20 bg-slate-900 text-white shadow">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <div>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            {admin && (
              <p className="text-xs text-slate-300">{admin.email}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-md bg-red-600 text-xs font-semibold hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        <nav className="px-2 py-2 overflow-x-auto">
          <ul className="flex gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    pathname === item.href
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-slate-900 text-white shadow-lg">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          {admin && (
            <p className="text-sm text-slate-400 mt-1">{admin.email}</p>
          )}
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-4 md:p-8 md:ml-64">
        {children}
      </main>
    </div>
  );
}

