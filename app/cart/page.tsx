'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import { useApi } from '../hooks/useApi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartItem } from '../lib/api/cart';
import { getProductPrice, getProductImage } from '../types';
import { getOrderId } from '../lib/api/orders';

export default function CartPage() {
  const router = useRouter();
  const { requireAuth, isAuthenticated } = useAuth();
  const api = useApi();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth(() => {});
      return;
    }

    fetchCart();
  }, [isAuthenticated]);

  // Refresh cart when page becomes visible (e.g., when navigating back from product page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        fetchCart();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.cart.getCart();
      if (response.success && response.data) {
        // Backend returns 'cart' but frontend expects 'items'
        const items = response.data.items || response.data.cart || [];
        setCartItems(items);
      }
    } catch (err: any) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart. Please try again.');
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

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(cartItemId);
      return;
    }

    const cartItem = cartItems.find(item => item.id === cartItemId);
    if (!cartItem) return;

    try {
      setUpdating(cartItemId);
      setError(null);
      
      // Remove the item and add it back with new quantity
      await api.cart.removeFromCart(cartItemId);
      await api.cart.addToCart({
        productId: cartItem.productId,
        quantity: newQuantity,
      });
      
      // Refresh cart
      await fetchCart();
    } catch (err: any) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity. Please try again.');
      // Refresh cart to restore previous state
      await fetchCart();
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      setUpdating(cartItemId);
      setError(null);
      await api.cart.removeFromCart(cartItemId);
      await fetchCart();
    } catch (err: any) {
      console.error('Error removing item:', err);
      setError('Failed to remove item. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const handleProceedToCheckout = async () => {
    requireAuth(async () => {
      if (cartItems.length === 0) {
        setError('Your cart is empty. Please add items to cart first.');
        return;
      }

      try {
        setProcessingCheckout(true);
        setError(null);

        // Get all cart item IDs
        const cartItemIds = cartItems.map(item => item.id).filter(Boolean);
        
        if (cartItemIds.length === 0) {
          setError('No valid cart items found. Please refresh your cart.');
          return;
        }

        // Create order from cart items
        const orderResponse = await api.orders.create({
          cartItemIds,
        });

        if (!orderResponse.success || !orderResponse.data) {
          setError('Failed to create order. Please try again.');
          return;
        }

        const order = orderResponse.data;
        const orderId = getOrderId(order);
        
        if (!orderId) {
          setError('Order created but could not get order ID. Please contact support.');
          return;
        }

        // Initialize payment for the order
        const paymentResponse = await api.orders.initializePayment(orderId);

        if (paymentResponse.success && paymentResponse.data?.authorizationUrl) {
          // Redirect to Paystack payment page
          window.location.href = paymentResponse.data.authorizationUrl;
        } else {
          setError('Failed to initialize payment. Please try again.');
        }
      } catch (err: any) {
        console.error('Error during checkout:', err);
        setError(err.message || 'Failed to process checkout. Please try again.');
      } finally {
        setProcessingCheckout(false);
      }
    });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getProductPrice(item.product) * item.quantity,
    0
  );
  const shipping = 2500;
  const tax = 0;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center py-12">
                <div className="text-gray-500">Loading cart...</div>
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
              Your Shopping Cart
            </h1>

            {error && (
              <div className="mb-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                      href="/shop-all"
                      className="inline-block rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-600"
                    >
                      Continue Shopping
                    </Link>
                    <Link
                      href="/my-orders"
                      className="inline-block rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      View All Orders
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column - Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => {
                    if (!item.product) {
                      return null; // Skip items with missing product data
                    }
                    
                    const isUpdating = updating === item.id;
                    const productPrice = getProductPrice(item.product);
                    const productImage = getProductImage(item.product);
                    
                    return (
                  <div
                        key={item.id}
                    className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={productImage}
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
                        {formatPrice(productPrice)}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={isUpdating}
                              className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isUpdating}
                              className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          onClick={() => removeItem(item.id)}
                          disabled={isUpdating}
                          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                          {isUpdating ? (
                            <span className="text-xs">Removing...</span>
                          ) : (
                            <>
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
                            </>
                          )}
                    </button>
                  </div>
                    );
                  })}
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
                      onClick={handleProceedToCheckout}
                      disabled={processingCheckout || cartItems.length === 0}
                      className="mt-6 block w-full rounded-lg bg-pink-500 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingCheckout ? 'Processing...' : 'Proceed to Checkout'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

