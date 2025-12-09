'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { orders } from '../data/orders';
import { products } from '../data/products';

export default function AccountPage() {
  const [formData, setFormData] = useState({
    name: 'Amina Bakare',
    email: 'amina.b@example.com',
    phone: '+2348012345678',
    address: '123 Luxury Lane, Lagos, Nigeria',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const wishlistItems = products.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
              Welcome, Amina!
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
                    {orders.slice(0, 2).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100">
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
                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {formatPrice(order.product.price)}
                          </p>
                        </div>
                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200">
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
                        </button>
                      </div>
                    ))}
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
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {wishlistItems.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Account Settings */}
              <div className="lg:col-span-1">
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    Account Settings
                  </h2>
                  <form className="space-y-4">
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
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
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
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
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
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
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
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-600"
                    >
                      Save Changes
                    </button>
                    <Link
                      href="/change-password"
                      className="block w-full rounded-lg border-2 border-pink-500 bg-white px-6 py-3 text-center font-semibold text-pink-500 transition-colors hover:bg-pink-50"
                    >
                      Change Password
                    </Link>
                  </form>
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

