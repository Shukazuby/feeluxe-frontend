/* Simple client-only auth gate: stores a fake token in localStorage to gate actions like add-to-cart/checkout.
 * This is a UX layer until real backend auth is wired. */
'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AuthMode = 'login' | 'signup';

interface AuthContextValue {
  isAuthenticated: boolean;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  requireAuth: (action: () => void) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('feeluxe-token') : null;
    setIsAuthenticated(Boolean(token));
  }, []);

  const openAuthModal = useCallback((nextMode: AuthMode = 'login') => {
    setMode(nextMode);
    setShowModal(true);
  }, []);

  const closeAuthModal = useCallback(() => setShowModal(false), []);

  const completeAuth = useCallback(
    (form: FormData) => {
      // For now, we simply set a local token to gate the UX.
      const email = form.get('email')?.toString() || '';
      if (email) {
        localStorage.setItem('feeluxe-token', `guest-${email}`);
        setIsAuthenticated(true);
        setShowModal(false);
      }
    },
    [],
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
      openAuthModal,
      closeAuthModal,
      requireAuth,
    }),
    [isAuthenticated, openAuthModal, closeAuthModal, requireAuth],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showModal && <AuthModal mode={mode} onClose={closeAuthModal} onSubmit={completeAuth} onSwitch={openAuthModal} />}
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
}: {
  mode: AuthMode;
  onClose: () => void;
  onSubmit: (form: FormData) => void;
  onSwitch: (mode: AuthMode) => void;
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
            className="w-full rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
          >
            {mode === 'login' ? 'Login to continue' : 'Create account'}
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

