'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '../lib/api/auth';
import { ApiError } from '../lib/api/config';
import { cartApi } from '../lib/api/cart';
import { guestCart } from '../lib/guestStorage';

type AuthMode = 'login' | 'signup' | 'forgot';

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
  const [success, setSuccess] = useState<string | null>(null);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');

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
    setSuccess(null);
    if (nextMode === 'forgot') {
      setForgotStep(1);
      setForgotEmail('');
    }
  }, []);

  const closeAuthModal = useCallback(() => {
    setShowModal(false);
    setError(null);
    setSuccess(null);
    setForgotStep(1);
    setForgotEmail('');
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
      setSuccess(null);
      
      try {
        if (mode === 'login') {
          const email = form.get('email')?.toString() || '';
          const password = form.get('password')?.toString() || '';
          
          const response = await authApi.login({ email, password });
          
          if (response.success && response.data?.token) {
            // Sync guest cart to backend before setting auth state
            const guestItems = guestCart.get();
            if (guestItems.length) {
              for (const item of guestItems) {
                const pid = (item.product as any)?.id || (item.product as any)?._id || item.product.id || (item.product as any)?._id;
                if (!pid) continue;
                try {
                  await cartApi.addToCart(response.data.token, {
                    productId: pid,
                    quantity: item.quantity,
                  });
                } catch (syncErr) {
                  console.error('Guest cart sync failed', syncErr);
                }
              }
              guestCart.clear();
            }

            localStorage.setItem('feeluxe-token', response.data.token);
            setToken(response.data.token);
            setIsAuthenticated(true);
            setShowModal(false);
          }
        } else if (mode === 'signup') {
          const name = form.get('name')?.toString() || '';
          const email = form.get('email')?.toString() || '';
          const password = form.get('password')?.toString() || '';
          const phone = form.get('phone')?.toString() || '';
          const address = form.get('address')?.toString() || '';
          
          const response = await authApi.signup({ name, email, password, phone, address });
          
          // Some signup responses may not include a token; fall back to logging in immediately.
          if (response.success && response.data?.token) {
            // Sync guest cart to backend before setting auth state
            const guestItems = guestCart.get();
            if (guestItems.length) {
              for (const item of guestItems) {
                const pid = (item.product as any)?.id || (item.product as any)?._id || item.product.id || (item.product as any)?._id;
                if (!pid) continue;
                try {
                  await cartApi.addToCart(response.data.token, {
                    productId: pid,
                    quantity: item.quantity,
                  });
                } catch (syncErr) {
                  console.error('Guest cart sync failed', syncErr);
                }
              }
              guestCart.clear();
            }

            localStorage.setItem('feeluxe-token', response.data.token);
            setToken(response.data.token);
            setIsAuthenticated(true);
            setShowModal(false);
            // Navigate to account page after successful signup
            router.push('/account');
          } else if (response.success) {
            // Attempt a login using the same credentials to fetch a token and proceed.
            const loginResp = await authApi.login({ email, password });
            if (loginResp.success && loginResp.data?.token) {
              const guestItems = guestCart.get();
              if (guestItems.length) {
                for (const item of guestItems) {
                  const pid = (item.product as any)?.id || (item.product as any)?._id || item.product.id || (item.product as any)?._id;
                  if (!pid) continue;
                  try {
                    await cartApi.addToCart(loginResp.data.token, {
                      productId: pid,
                      quantity: item.quantity,
                    });
                  } catch (syncErr) {
                    console.error('Guest cart sync failed', syncErr);
                  }
                }
                guestCart.clear();
              }

              localStorage.setItem('feeluxe-token', loginResp.data.token);
              setToken(loginResp.data.token);
              setIsAuthenticated(true);
              setShowModal(false);
              router.push('/account');
            } else {
              setError('Signup succeeded but login failed. Please try signing in.');
            }
          }
        } else if (mode === 'forgot') {
          const emailInput = form.get('email')?.toString() || forgotEmail || '';
          const email = emailInput.trim();
          if (forgotStep === 1) {
            if (!email) {
              setError('Please enter your email.');
            } else {
              const response = await authApi.forgotPassword({ email });
              if (response.success) {
                setForgotEmail(email);
                setForgotStep(2);
                setSuccess('We sent a 4-digit code to your email. Enter it below with your new password.');
              } else {
                setError(response.message || 'Failed to send reset code. Please try again.');
              }
            }
          } else {
            const code = form.get('code')?.toString() || '';
            const password = form.get('password')?.toString() || '';
            if (!code || !password) {
              setError('Enter the 4-digit code and a new password.');
            } else {
              const response = await authApi.resetPassword({ email, code, password });
              if (response.success) {
                setSuccess('Password reset successful. You can now log in.');
                setMode('login');
                setForgotStep(1);
                setForgotEmail('');
              } else {
                setError(response.message || 'Failed to reset password. Please try again.');
              }
            }
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
    [mode, forgotStep, forgotEmail],
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
          success={success}
          loading={loading}
          forgotStep={forgotStep}
          forgotEmail={forgotEmail}
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
  success,
  loading,
  forgotStep,
  forgotEmail,
}: {
  mode: AuthMode;
  onClose: () => void;
  onSubmit: (form: FormData) => void;
  onSwitch: (mode: AuthMode) => void;
  error: string | null;
  success: string | null;
  loading: boolean;
  forgotStep: 1 | 2;
  forgotEmail: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'login' && 'Login'}
            {mode === 'signup' && 'Create an account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {mode === 'login' &&
            'Sign in to save your cart and proceed to checkout.'}
          {mode === 'signup' &&
            'Create an account to save your cart and place orders.'}
          {mode === 'forgot' &&
            (forgotStep === 1
              ? 'Enter your email and we will send you a 4-digit reset code.'
              : 'Enter the 4-digit code from your email and your new password.')}
        </p>
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-3">
            <p className="text-sm text-green-600">{success}</p>
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
              defaultValue={mode === 'forgot' && forgotEmail ? forgotEmail : undefined}
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
          {mode !== 'forgot' && (
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
          )}
          {mode === 'login' && (
            <div className="flex justify-end text-xs">
              <button
                type="button"
                className="text-pink-500 hover:text-pink-600 font-semibold"
                onClick={() => onSwitch('forgot')}
              >
                Forgot password?
              </button>
            </div>
          )}
          {mode === 'forgot' && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {forgotStep === 1 ? 'We will send a 4-digit code to this email' : '4-digit code'}
                </label>
                {forgotStep === 1 ? (
                  <p className="text-xs text-gray-500">Enter your email above, then submit to receive the code.</p>
                ) : (
                  <input
                    name="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
                    placeholder="1234"
                  />
                )}
              </div>
              {forgotStep === 2 && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">New password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
                    placeholder="New password"
                  />
                </div>
              )}
            </>
          )}
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
            {loading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Login to continue'
              : mode === 'signup'
              ? 'Create account'
              : forgotStep === 1
              ? 'Send reset code'
              : 'Reset password'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          {mode === 'login' && (
            <>
              New here?{' '}
              <button className="font-semibold text-pink-500 hover:text-pink-600" onClick={() => onSwitch('signup')}>
                Create an account
              </button>
            </>
          )}
          {mode === 'signup' && (
            <>
              Already have an account?{' '}
              <button className="font-semibold text-pink-500 hover:text-pink-600" onClick={() => onSwitch('login')}>
                Login
              </button>
            </>
          )}
          {mode === 'forgot' && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <button className="font-semibold text-pink-500 hover:text-pink-600" onClick={() => onSwitch('login')}>
                Back to login
              </button>
              <button className="font-semibold text-pink-500 hover:text-pink-600" onClick={() => onSwitch('signup')}>
                Create account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

