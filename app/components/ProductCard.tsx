/* Client card to allow wishlist action. */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Product, getProductId, getProductPrice, getProductImage } from '../types';
import { useAuth } from './AuthProvider';
import { useApi } from '../hooks/useApi';
import { guestCart, guestWishlist } from '../lib/guestStorage';

interface ProductCardProps {
  product: Product;
  onWishlistChange?: () => void; // Callback for when wishlist changes
}

export default function ProductCard({ product, onWishlistChange }: ProductCardProps) {
  const { requireAuth, isAuthenticated } = useAuth();
  const api = useApi();
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  const productId = getProductId(product);
  const productPrice = getProductPrice(product);
  const productImage = getProductImage(product);

  // Check if product is in wishlist when component mounts and user is authenticated
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !productId) {
        setCheckingWishlist(false);
        return;
      }

      try {
        const response = await api.customers.getWishlist();
        if (response.success && response.data) {
          // Backend returns data as an array directly
          const wishlistProducts = Array.isArray(response.data) 
            ? response.data 
            : [];
          const isInWishlist = wishlistProducts.some(
            (p: Product) => getProductId(p) === productId
          );
          setWishlisted(isInWishlist);
        }
      } catch (error) {
        console.error('Error checking wishlist:', error);
      } finally {
        setCheckingWishlist(false);
      }
    };

    checkWishlistStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, productId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWishlist = async () => {
    if (!productId) return;

    // Guest mode: store locally
    if (!isAuthenticated) {
      if (wishlisted) {
        guestWishlist.remove(productId);
        setWishlisted(false);
      } else {
        guestWishlist.add(product);
        setWishlisted(true);
      }
      onWishlistChange?.();
      return;
    }

    // Authenticated flow
    requireAuth(async () => {
      setLoading(true);
      try {
        if (wishlisted) {
          await api.customers.removeFromWishlist(productId);
          setWishlisted(false);
        } else {
          await api.customers.addToWishlist({ productId });
          setWishlisted(true);
        }
        onWishlistChange?.();
      } catch (error) {
        console.error('Error updating wishlist:', error);
      } finally {
        setLoading(false);
      }
    });
  };

  const handleAddToCart = async () => {
    if (!productId) return;

    // Guest mode: store locally
    if (!isAuthenticated) {
      setAddingToCart(true);
      guestCart.add(product, 1);
      setCartMessage('Added to cart');
      setTimeout(() => setCartMessage(null), 1200);
      setAddingToCart(false);
      return;
    }

    // Authenticated flow
    requireAuth(async () => {
      setAddingToCart(true);
      try {
        await api.cart.addToCart({
          productId,
          quantity: 1,
        });
        setCartMessage('Added to cart');
        setTimeout(() => setCartMessage(null), 1200);
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setAddingToCart(false);
      }
    });
  };

  return (
    <div className="group overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Link href={`/products/${productId}`}>
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>
        {/* Add to Cart Button - Bottom Left */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          disabled={addingToCart}
          className="absolute left-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow transition hover:bg-pink-50 hover:border-pink-300 hover:text-pink-500 disabled:opacity-50"
          aria-label="Add to cart"
        >
          {addingToCart ? (
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          )}
        </button>
        {/* Wishlist Button - Top Right */}
        <button
          onClick={handleWishlist}
          disabled={loading || checkingWishlist}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 text-pink-500 shadow transition hover:bg-pink-50 disabled:opacity-50 ${
            wishlisted ? 'border-pink-500' : 'border-gray-200'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className="h-5 w-5"
            fill={wishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"
            />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <Link href={`/products/${productId}`}>
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="mt-2 text-sm font-semibold text-gray-900">
            {formatPrice(productPrice)}
          </p>
        </Link>
        {cartMessage && (
          <p className="mt-2 text-xs font-semibold text-pink-600">{cartMessage}</p>
        )}
      </div>
    </div>
  );
}

