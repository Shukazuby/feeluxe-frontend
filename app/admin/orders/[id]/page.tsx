'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi, Order } from '@/app/lib/api/admin';

export default function AdminOrderDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = params?.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<Order['status'] | ''>('');

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await adminApi.getOrder(orderId);
        if (response.success && response.data) {
          setOrder(response.data);
          setStatus(response.data.status);
        } else {
          setError(response.message || 'Failed to load order');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    if (!order || !status) return;

    setUpdating(true);
    setError('');
    try {
      const response = await adminApi.updateOrder(order._id || order.id || '', {
        status,
      });
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        setError(response.message || 'Failed to update order');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-600">Loading order...</div>;
  }

  if (error && !order) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.push('/admin/orders')}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Back to Orders
        </button>
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const placedDate = new Date(order.placedAt).toLocaleString();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Order {order.orderNumber}
          </h1>
          <p className="text-gray-600 mt-2">
            Placed on {placedDate} • Total:{' '}
            <span className="font-semibold">
              ₦{order.totalAmount.toLocaleString()}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/orders')}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Back to Orders
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order & Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Payment */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Order Status
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}
              >
                {order.status}
              </span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : order.paymentStatus === 'initiated'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                Payment: {order.paymentStatus}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as Order['status'] | '')
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={updating || !status}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Items
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {order.items.map((item, idx) => (
                <div
                  key={`${item.productId}-${idx}`}
                  className="p-6 flex items-center gap-4"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        {item.category && (
                          <p className="text-xs text-gray-500">
                            {item.category}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900 font-semibold">
                          ₦{item.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Customer & Shipping */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Customer Details
            </h2>
            <div className="text-sm space-y-1">
              <p className="text-gray-900 font-medium">
                {order.contactName || 'N/A'}
              </p>
              <p className="text-gray-600">{order.contactEmail || 'N/A'}</p>
              <p className="text-gray-600">
                User ID: <span className="font-mono text-xs">{order.userId || 'N/A'}</span>
              </p>
            </div>
          </div>

          {/* Shipping & Totals */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Shipping & Summary
            </h2>
            <div className="text-sm space-y-2">
              <p className="text-gray-700 font-medium">Shipping Address</p>
              <p className="text-gray-600 whitespace-pre-line">
                {order.shippingAddress || 'N/A'}
              </p>
            </div>

            {order.notes && (
              <div className="text-sm space-y-2">
                <p className="text-gray-700 font-medium">Customer Notes</p>
                <p className="text-gray-600 whitespace-pre-line">
                  {order.notes}
                </p>
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Items Total</span>
                <span className="font-medium text-gray-900">
                  ₦{order.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className="font-medium text-gray-900">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


