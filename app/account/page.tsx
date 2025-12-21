'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../components/AuthProvider';
import { Product, getProductId, getProductPrice, getProductImage } from '../types';
import { Order as ApiOrder, getOrderId } from '../lib/api/orders';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const api = useApi();
  const router = useRouter();
  const { isAuthenticated, requireAuth, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [deleting, setDeleting] = useState(false);

  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth(() => {});
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile
        const profileResponse = await api.customers.getProfile();
        if (profileResponse.success && profileResponse.data) {
          const profile = profileResponse.data;
          setFormData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            address: profile.address || '',
          });
        }

        // Fetch orders
        const ordersResponse = await api.orders.getAll({ limit: 2 });
        if (ordersResponse.success && ordersResponse.data) {
          const ordersData = ordersResponse.data.data || [];
          setOrders(ordersData);
        }

        // Fetch wishlist
        const wishlistResponse = await api.customers.getWishlist();
        if (wishlistResponse.success && wishlistResponse.data) {
          // Backend returns data as an array directly
          const wishlistData = Array.isArray(wishlistResponse.data) 
            ? wishlistResponse.data 
            : [];
          setWishlistItems(wishlistData);
        }
      } catch (err: any) {
        console.error('Error fetching account data:', err);
        setError('Failed to load account data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      requireAuth(() => {});
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await api.customers.updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!isAuthenticated) {
      requireAuth(() => {});
      return;
    }
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      setError(null);
      setSuccess(null);

      const resp = await api.customers.deleteAccount();
      if (resp.success) {
        setSuccess('Account deleted. Redirecting...');
        // Logout and redirect to home
        logout();
        router.push('/');
      } else {
        setError(resp.message || 'Failed to delete account. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center py-12">
                <div className="text-gray-500">Loading account data...</div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
              Welcome, {formData.name || 'User'}!
            </h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Order History */}
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">
                    Order History
                  </h2>
                  <div className="space-y-4">
                    {orders.length > 0 ? (
                      orders.map((order) => {
                        const firstItem = order.items?.[0];
                        const orderDate = order.placedAt 
                          ? new Date(order.placedAt).toLocaleDateString()
                          : 'N/A';
                        const orderId = getOrderId(order);
                        
                        return (
                          <div
                            key={orderId}
                        className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4"
                      >
                            {firstItem?.imageUrl && (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100">
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
                                {firstItem?.name || 'Order Items'}
                          </h3>
                          <p className="text-sm text-gray-600">
                                Order #{order.orderNumber} - Placed on {orderDate}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-gray-900">
                                {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                            <Link
                              href={`/orders/${orderId}`}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200"
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                            </Link>
                      </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 py-4">No orders yet.</p>
                    )}
                  </div>
                  <Link
                    href="/my-orders"
                    className="mt-4 inline-block rounded-lg bg-pink-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-pink-600"
                  >
                    View All Orders
                  </Link>
                </div>

                {/* Wishlist */}
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">
                    Wishlist / Saved Items
                  </h2>
                  {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {wishlistItems.map((product) => (
                        <ProductCard 
                          key={getProductId(product)} 
                          product={product}
                          onWishlistChange={async () => {
                            // Refresh wishlist when item is removed
                            try {
                              const wishlistResponse = await api.customers.getWishlist();
                              if (wishlistResponse.success && wishlistResponse.data) {
                                // Backend returns data as an array directly
                                const wishlistData = Array.isArray(wishlistResponse.data) 
                                  ? wishlistResponse.data 
                                  : [];
                                setWishlistItems(wishlistData);
                              }
                            } catch (err) {
                              console.error('Error refreshing wishlist:', err);
                            }
                          }}
                        />
                    ))}
                  </div>
                  ) : (
                    <p className="text-gray-500 py-4">Your wishlist is empty.</p>
                  )}
                </div>
              </div>

              {/* Right Column - Account Settings */}
              <div className="lg:col-span-1">
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    Account Settings
                  </h2>
                  {error && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  {success && (
                    <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3">
                      <p className="text-sm text-green-600">{success}</p>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        disabled
                        className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-600 cursor-not-allowed focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        placeholder="+234 801 234 5678"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="address"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Shipping Address
                      </label>
                      <textarea
                        id="address"
                        rows={3}
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        placeholder="123 Luxury Lane, Lagos, Nigeria"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <Link
                      href="/change-password"
                      className="block w-full rounded-lg border-2 border-pink-500 bg-white px-6 py-3 text-center font-semibold text-pink-500 transition-colors hover:bg-pink-50"
                    >
                      Change Password
                    </Link>
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 text-sm font-bold">
                          !
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-red-700">Delete Account</p>
                          <p className="mt-1 text-sm text-red-600">
                            This action is irreversible and will remove your account.
                          </p>
                          <button
                            onClick={handleDeleteAccount}
                            disabled={deleting}
                            className="mt-3 inline-flex items-center rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deleting ? 'Deleting...' : 'Delete my account'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  
                  {/* Logout Button */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <button
                      onClick={() => {
                        logout();
                        router.push('/');
                      }}
                      className="w-full rounded-lg border-2 border-red-500 bg-white px-6 py-3 font-semibold text-red-500 transition-colors hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

