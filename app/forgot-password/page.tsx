'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { authApi } from '../lib/api/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const resp = await authApi.forgotPassword({ email: email.trim() });
      if (resp.success) {
        setSuccess('Check your email for a password reset link.');
        setEmail('');
      } else {
        setError(resp.message || 'Failed to send reset email. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
            <h1 className="mb-3 text-3xl font-bold text-gray-900">Forgot Password</h1>
            <p className="mb-6 text-sm text-gray-600">
              Enter the email associated with your account and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                    if (success) setSuccess(null);
                  }}
                  required
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-pink-500 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send reset code'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Remembered your password?{' '}
              <Link href="/" className="font-semibold text-pink-500 hover:text-pink-600">
                Go back
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


