'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { orders } from '../data/orders';

export default function MyOrdersPage() {
  const [orderStatus, setOrderStatus] = useState('');
  const [dateRange, setDateRange] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600';
      case 'shipped':
        return 'text-orange-600';
      case 'pending':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
              My Orders
            </h1>

            {/* Filter Bar */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="flex-1 rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              >
                <option value="">Order Status</option>
                <option value="delivered">Delivered</option>
                <option value="shipped">Shipped</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="flex-1 rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              >
                <option value="">Date Range</option>
                <option value="last-week">Last Week</option>
                <option value="last-month">Last Month</option>
                <option value="last-3-months">Last 3 Months</option>
              </select>
              <button className="rounded-lg bg-pink-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-pink-600">
                Apply Filters
              </button>
            </div>

            {/* Order List */}
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={order.product.image}
                      alt={order.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {order.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Order #{order.orderNumber} - Placed on {order.date}
                    </p>
                    <p
                      className={`mt-1 text-sm font-medium capitalize ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatPrice(order.product.price)}
                    </p>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    View Details
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-white transition-colors hover:bg-pink-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="text-gray-700">Page 1 of 3</span>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-white transition-colors hover:bg-pink-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

