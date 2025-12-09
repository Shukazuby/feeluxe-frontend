/* Client card to allow wishlist action. */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthProvider';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { requireAuth } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWishlist = () => {
    requireAuth(() => setWishlisted(true));
  };

  return (
    <div className="group overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>
        <button
          onClick={handleWishlist}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 text-pink-500 shadow transition hover:bg-pink-50 ${
            wishlisted ? 'border-pink-500' : 'border-gray-200'
          }`}
          aria-label="Add to wishlist"
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
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="mt-2 text-sm font-semibold text-gray-900">
            {formatPrice(product.price)}
          </p>
        </Link>
      </div>
    </div>
  );
}

