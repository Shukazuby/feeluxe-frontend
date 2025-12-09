'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PaymentConfirmationPage() {
  // In a real app, order/payment details would come from query params or API fetch.
  const status = 'success';
  const orderNumber = 'FLX-12345';
  const amount = 45000;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);

  const isSuccess = status === 'success';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}
              >
                {isSuccess ? (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              {isSuccess ? 'Payment Successful' : 'Payment Failed'}
            </h1>
            <p className="mt-3 text-gray-700">
              {isSuccess
                ? 'Thank you for your purchase. Your payment has been confirmed.'
                : 'We could not confirm your payment. Please try again or contact support.'}
            </p>

            <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order</p>
                  <p className="text-lg font-semibold text-gray-900">#{orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-lg font-semibold text-gray-900">{formatPrice(amount)}</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                A confirmation email has been sent to your inbox. You can track your order in your account.
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/my-orders"
                className="rounded-lg bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-600 text-center"
              >
                View my orders
              </Link>
              <Link
                href="/shop-all"
                className="rounded-lg border border-pink-200 px-6 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-50 text-center"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

