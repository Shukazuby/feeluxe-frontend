'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../components/AuthProvider';
import { useApi } from '../hooks/useApi';
import { Order, getOrderId } from '../lib/api/orders';
import { getProductImage } from '../types';

export default function MyOrdersPage() {
  const { requireAuth, isAuthenticated } = useAuth();
  const api = useApi();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth(() => {});
      return;
    }

    fetchOrders();
  }, [isAuthenticated, orderStatus, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {
        page: currentPage,
        limit: 10,
      };

      if (orderStatus) {
        filters.status = orderStatus;
      }

      // Handle date range if needed
      if (dateRange) {
        const now = new Date();
        let startDate = new Date();
        
        switch (dateRange) {
          case 'last-week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'last-month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'last-3-months':
            startDate.setMonth(now.getMonth() - 3);
            break;
        }
        filters.startDate = startDate.toISOString();
        filters.endDate = now.toISOString();
      }

      const response = await api.orders.getAll(filters);
      if (response.success && response.data) {
        setOrders(response.data.data || []);
        // Calculate total pages if totalCount is available
        const totalCount = response.data.totalCount || 0;
        setTotalPages(Math.ceil(totalCount / 10));
      } else {
        setError('Failed to load orders. Please try again.');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchOrders();
  };

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
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
              <button 
                onClick={handleApplyFilters}
                className="rounded-lg bg-pink-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-pink-600"
              >
                Apply Filters
              </button>
            </div>

            {/* Order List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="text-gray-500">Loading orders...</div>
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
                >
                  Try Again
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No orders found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const firstItem = order.items?.[0];
                  const orderDate = order.placedAt 
                    ? formatDate(order.placedAt)
                    : 'N/A';
                  const orderId = getOrderId(order);
                  
                  return (
                    <div
                      key={orderId}
                      className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
                    >
                      {firstItem?.imageUrl && (
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={firstItem.imageUrl}
                            alt={firstItem.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {firstItem?.name || `Order #${order.orderNumber}`}
                        </h3>
                        {order.items && order.items.length > 1 && (
                          <p className="text-xs text-gray-500 mt-1">
                            +{order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Order #{order.orderNumber} - Placed on {orderDate}
                        </p>
                        <p
                          className={`mt-1 text-sm font-medium capitalize ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                      <Link
                        href={`/orders/${orderId}`}
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
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && orders.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-white transition-colors hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
                <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-white transition-colors hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

