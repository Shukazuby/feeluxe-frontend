'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../lib/api/auth';
import { ApiError } from '../lib/api/config';

type AuthMode = 'login' | 'signup';

interface AuthContextValue {
  isAuthenticated: boolean;
  token: string | null;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  requireAuth: (action: () => void) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('feeluxe-token') : null;
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const openAuthModal = useCallback((nextMode: AuthMode = 'login') => {
    setMode(nextMode);
    setShowModal(true);
    setError(null);
  }, []);

  const closeAuthModal = useCallback(() => {
    setShowModal(false);
    setError(null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('feeluxe-token');
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const completeAuth = useCallback(
    async (form: FormData) => {
      setLoading(true);
      setError(null);
      
      try {
        if (mode === 'login') {
          const email = form.get('email')?.toString() || '';
          const password = form.get('password')?.toString() || '';
          
          const response = await authApi.login({ email, password });
          
          if (response.success && response.data?.token) {
            localStorage.setItem('feeluxe-token', response.data.token);
            setToken(response.data.token);
            setIsAuthenticated(true);
            setShowModal(false);
          }
        } else {
          const name = form.get('name')?.toString() || '';
          const email = form.get('email')?.toString() || '';
          const password = form.get('password')?.toString() || '';
          const phone = form.get('phone')?.toString() || '';
          const address = form.get('address')?.toString() || '';
          
          const response = await authApi.signup({ name, email, password, phone, address });
          
          if (response.success && response.data?.token) {
            localStorage.setItem('feeluxe-token', response.data.token);
            setToken(response.data.token);
            setIsAuthenticated(true);
            setShowModal(false);
            // Navigate to account page after successful signup
            router.push('/account');
          }
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message || 'An error occurred. Please try again.');
        } else {
          setError('Network error. Please check your connection.');
        }
      } finally {
        setLoading(false);
      }
    },
    [mode],
  );

  const requireAuth = useCallback(
    (action: () => void) => {
      if (isAuthenticated) {
        action();
      } else {
        openAuthModal('login');
        const interval = setInterval(() => {
          const token = localStorage.getItem('feeluxe-token');
          if (token) {
            clearInterval(interval);
            setIsAuthenticated(true);
            setShowModal(false);
            action();
          }
        }, 300);
      }
    },
    [isAuthenticated, openAuthModal],
  );

  const value = useMemo(
    () => ({
      isAuthenticated,
      token,
      openAuthModal,
      closeAuthModal,
      requireAuth,
      logout,
    }),
    [isAuthenticated, token, openAuthModal, closeAuthModal, requireAuth, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showModal && (
        <AuthModal
          mode={mode}
          onClose={closeAuthModal}
          onSubmit={completeAuth}
          onSwitch={openAuthModal}
          error={error}
          loading={loading}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function AuthModal({
  mode,
  onClose,
  onSubmit,
  onSwitch,
  error,
  loading,
}: {
  mode: AuthMode;
  onClose: () => void;
  onSubmit: (form: FormData) => void;
  onSwitch: (mode: AuthMode) => void;
  error: string | null;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{mode === 'login' ? 'Login' : 'Create an account'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {mode === 'login'
            ? 'Sign in to save your cart and proceed to checkout.'
            : 'Create an account to save your cart and place orders.'}
        </p>
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            onSubmit(form);
          }}
        >
          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
              placeholder="you@example.com"
            />
          </div>
          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
              <input
                name="phone"
                type="tel"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
                placeholder="+234 801 234 5678"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
              placeholder="••••••••"
            />
          </div>
          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
              <input
                name="address"
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
                placeholder="123 Luxury Lane, Lagos"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login to continue' : 'Create account'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              New here?{' '}
              <button className="font-semibold text-pink-500 hover:text-pink-600" onClick={() => onSwitch('signup')}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button className="font-semibold text-pink-500 hover:text-pink-600" onClick={() => onSwitch('login')}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

