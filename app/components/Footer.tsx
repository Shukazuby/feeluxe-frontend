'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { newsletterApi } from '../lib/api/newsletter';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const response = await newsletterApi.subscribe({ email: email.trim() });

      if (response.success) {
        setSuccess(true);
        setEmail('');
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(response.message || 'Failed to subscribe. Please try again.');
      }
    } catch (err: any) {
      console.error('Error subscribing to newsletter:', err);
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-pink-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-2 flex items-center gap-2 sm:mb-3 md:mb-4">
              <div className="h-5 w-5 rounded bg-pink-500 sm:h-6 sm:w-6"></div>
              <span className="text-base font-semibold text-black sm:text-lg md:text-xl">
                Feeluxe.ng
              </span>
            </Link>
            <p className="text-xs text-gray-600 sm:text-sm">
              Timeless luxury, inspired by heritage.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold text-black sm:mb-3 sm:text-sm md:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/faqs"
                  className="text-xs text-gray-600 hover:text-pink-500 sm:text-sm"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-returns"
                  className="text-xs text-gray-600 hover:text-pink-500 sm:text-sm"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-xs text-gray-600 hover:text-pink-500 sm:text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold text-black sm:mb-3 sm:text-sm md:mb-4">
              Company
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/about-us"
                  className="text-xs text-gray-600 hover:text-pink-500 sm:text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-xs text-gray-600 hover:text-pink-500 sm:text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-2 text-xs font-semibold text-black sm:mb-3 sm:text-sm md:mb-4">
              Newsletter
            </h3>
            <p className="mb-2 text-xs text-gray-600 sm:mb-3 sm:text-sm md:mb-4">
              Get exclusive offers and style tips.
            </p>
            <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2">
              {success && (
                <div className="rounded-lg bg-green-50 p-1.5 text-[10px] text-green-800 sm:p-2 sm:text-xs">
                  Successfully subscribed!
                </div>
              )}
              {error && (
                <div className="rounded-lg bg-red-50 p-1.5 text-[10px] text-red-800 sm:p-2 sm:text-xs">
                  {error}
                </div>
              )}
              <div className="flex gap-1.5 sm:gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                    if (success) setSuccess(false);
                  }}
                  placeholder="Your email"
                  required
                  className="flex-1 rounded border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 sm:px-3 sm:py-2 sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded bg-pink-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
                >
                  {loading ? '...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-4 border-t border-pink-200 pt-4 text-center sm:mt-6 sm:pt-6 md:mt-8 md:pt-8">
          <p className="text-xs text-gray-600 sm:text-sm">
            © 2024 Feeluxe.ng. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

