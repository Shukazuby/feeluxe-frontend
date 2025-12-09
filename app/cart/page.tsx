'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { products } from '../data/products';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { product: products[0], quantity: 1 }, // The Adanna Scarf
    { product: products[2], quantity: 1 }, // The Chidinma Scarf
    { product: products[1], quantity: 2 }, // The Ifeoma Scarf
  ]);
  const router = useRouter();
  const { requireAuth } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const updateQuantity = (index: number, change: number) => {
    setCartItems((items) => {
      const newItems = [...items];
      const newQuantity = newItems[index].quantity + change;
      if (newQuantity > 0) {
        newItems[index].quantity = newQuantity;
      }
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    setCartItems((items) => items.filter((_, i) => i !== index));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 2500;
  const tax = 0;
  const total = subtotal + shipping + tax;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
              Your Shopping Cart
            </h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column - Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
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
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="w-8 text-center text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
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
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h2 className="mb-6 text-xl font-bold text-gray-900">
                    Order Summary
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping Estimate</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax Estimate</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Order Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => requireAuth(() => router.push('/checkout'))}
                      className="mt-6 block w-full rounded-lg bg-pink-500 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-pink-600"
                    >
                      Proceed to Checkout
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

