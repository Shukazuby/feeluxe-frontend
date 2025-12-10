'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../components/AuthProvider';
import { useApi } from '../../hooks/useApi';
import { Order, getOrderId } from '../../lib/api/orders';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { requireAuth, isAuthenticated } = useAuth();
  const api = useApi();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = typeof params.id === 'string' ? params.id : params.id?.[0] || '';

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth(() => {});
      return;
    }

    if (orderId) {
      fetchOrder();
    }
  }, [isAuthenticated, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.orders.getById(orderId);
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        setError('Order not found');
      }
    } catch (err: any) {
      console.error('Error fetching order:', err);
      setError(err.message || 'Failed to load order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusTextColor = (status: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center py-12">
                <div className="text-gray-500">Loading order details...</div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  {error || 'Order not found'}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => router.push('/my-orders')}
                    className="rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-600"
                  >
                    Back to Orders
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const shipping = 0; // Fixed shipping cost
  const tax = 0;
  const total = order.totalAmount || (subtotal + shipping + tax);

  // Parse shipping address to extract components (if structured)
  const parseAddress = (address: string) => {
    // Try to parse address components, fallback to full address
    const parts = address.split(',').map(p => p.trim());
    return {
      street: parts[0] || address,
      city: parts[1] || '',
      state: parts[2] || 'Lagos',
      zipCode: parts[3] || '',
      country: 'Nigeria',
    };
  };

  const addressParts = order.shippingAddress ? parseAddress(order.shippingAddress) : null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Page Title */}
            <h1 className="mb-8 text-4xl font-bold text-gray-900">Order Details</h1>

            {/* Order Details Section */}
            <div className="mb-8 rounded-lg bg-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{order.orderNumber}
                  </h2>
                  <p className="mt-1 text-gray-700">
                    Placed on: {formatDate(order.placedAt)}
                    <span className="mx-2">•</span>
                    <span className={`font-semibold ${getStatusTextColor(order.status)}`}>
                      Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Products in Order Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Products in Order</h2>
              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-6 rounded-lg border border-gray-200 bg-white p-4"
                    >
                      {item.imageUrl && (
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items found</p>
                )}
              </div>
            </div>

            {/* Shipping Information and Order Tracking Grid */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Shipping Information */}
              {order.shippingAddress && (
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">
                    Shipping Information
                  </h2>
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="space-y-2 text-gray-700">
                      {order.contactName && (
                        <p>
                          <span className="font-semibold">Name:</span> {order.contactName}
                        </p>
                      )}
                      <p>
                        <span className="font-semibold">Address:</span> {addressParts?.street || order.shippingAddress}
                      </p>
                      {addressParts?.city && (
                        <p>
                          <span className="font-semibold">City:</span> {addressParts.city}
                        </p>
                      )}
                      {addressParts?.state && (
                        <p>
                          <span className="font-semibold">State:</span> {addressParts.state}
                        </p>
                      )}
                      {addressParts?.zipCode && (
                        <p>
                          <span className="font-semibold">Zip Code:</span> {addressParts.zipCode}
                        </p>
                      )}
                      <p>
                        <span className="font-semibold">Country:</span> {addressParts?.country || 'Nigeria'}
                      </p>
                      {order.contactEmail && (
                        <p>
                          <span className="font-semibold">Phone:</span> {order.contactEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Tracking & Support */}
              <div>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  Order Tracking & Support
                </h2>
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="space-y-4">
                    {/* Payment Status */}
                    <div>
                      <p className="mb-2 text-sm font-semibold text-gray-700">Payment Status</p>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}
                        </span>
                        {(order.paymentStatus === 'initiated' || order.paymentStatus === 'failed') && (
                          <span className="text-xs text-red-600 font-medium">
                            Payment not successful
                          </span>
                        )}
                      </div>
                      {(order.paymentStatus === 'initiated' || order.paymentStatus === 'failed') && (
                        <p className="mt-2 text-xs text-gray-600">
                          Your payment was not completed. Please try again to complete your order.
                        </p>
                      )}
                    </div>

                    {/* Order Status Timeline */}
                    <div>
                      <p className="mb-3 text-sm font-semibold text-gray-700">Order Progress</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            (order.paymentStatus === 'initiated' || order.paymentStatus === 'failed')
                              ? 'bg-yellow-100 text-yellow-600' 
                              : order.status !== 'cancelled' && order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {(order.paymentStatus === 'initiated' || order.paymentStatus === 'failed') ? (
                              <div className="h-2 w-2 rounded-full bg-current" />
                            ) : order.status !== 'cancelled' && order.paymentStatus === 'paid' ? (
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <div className="h-2 w-2 rounded-full bg-current" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Order Placed</p>
                            <p className="text-xs text-gray-500">{formatDate(order.placedAt)}</p>
                            {(order.paymentStatus === 'initiated' || order.paymentStatus === 'failed') && (
                              <button
                                onClick={async () => {
                                  try {
                                    const orderIdValue = getOrderId(order);
                                    if (!orderIdValue) return;
                                    const response = await api.orders.initializePayment(orderIdValue);
                                    if (response.success && response.data?.authorizationUrl) {
                                      window.location.href = response.data.authorizationUrl;
                                    }
                                  } catch (err) {
                                    console.error('Error initializing payment:', err);
                                  }
                                }}
                                className="mt-2 rounded-lg bg-pink-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-pink-600"
                              >
                                Try Again
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-green-100 text-green-600' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                            {['shipped', 'delivered'].includes(order.status) ? (
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <div className="h-2 w-2 rounded-full bg-current" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Processing</p>
                            <p className="text-xs text-gray-500">Preparing your order</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${order.status === 'shipped' ? 'bg-green-100 text-green-600' : order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {['shipped', 'delivered'].includes(order.status) ? (
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <div className="h-2 w-2 rounded-full bg-current" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Shipped</p>
                            <p className="text-xs text-gray-500">On the way</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {order.status === 'delivered' ? (
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <div className="h-2 w-2 rounded-full bg-current" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Delivered</p>
                            <p className="text-xs text-gray-500">Arrived at destination</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Support Section */}
                    <div className="border-t border-gray-200 pt-4">
                      <p className="mb-3 text-sm font-semibold text-gray-700">Need Help?</p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700"
                      >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Contact Support
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Financial Summary</h2>
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span className="font-semibold">{formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Grand Total:</span>
                      <span className="text-lg font-bold text-pink-500">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Button for Pending Orders (only show if payment status is not initiated or failed) */}
            {order.status === 'pending' && order.paymentStatus !== 'paid' && order.paymentStatus !== 'initiated' && order.paymentStatus !== 'failed' && (
              <div className="flex justify-center">
                <button
                  onClick={async () => {
                    try {
                      const orderIdValue = getOrderId(order);
                      if (!orderIdValue) return;
                      const response = await api.orders.initializePayment(orderIdValue);
                      if (response.success && response.data?.authorizationUrl) {
                        window.location.href = response.data.authorizationUrl;
                      }
                    } catch (err) {
                      console.error('Error initializing payment:', err);
                    }
                  }}
                  className="rounded-lg bg-pink-500 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-pink-600"
                >
                  Pay Now
                </button>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-8">
              <Link
                href="/my-orders"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="mr-2 h-4 w-4"
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
                Back to Orders
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

