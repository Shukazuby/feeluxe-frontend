'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { products } from '../../data/products';
import { useAuth } from '../../components/AuthProvider';

export default function ProductDetailPage() {
  const params = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'description'
  );
  const router = useRouter();
  const { requireAuth } = useAuth();

  const productId = typeof params.id === 'string' ? params.id : params.id?.[0] || '';
  const product = products.find((p) => p.id === productId) || products[0];
  const relatedProducts = products.slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left Column - Product Images */}
              <div>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="mt-4 flex gap-4">
                  {relatedProducts.map((p, index) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                        selectedImageIndex === index
                          ? 'border-pink-500'
                          : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column - Product Details */}
              <div>
                <h1 className="mb-4 text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="mb-6 text-3xl font-semibold text-pink-500">
                  {formatPrice(product.price)}
                </p>
                <button
                  onClick={() => requireAuth(() => router.push('/cart'))}
                  className="mb-8 block w-full rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:from-pink-600 hover:to-pink-700"
                >
                  Add to Cart
                </button>

                {/* Product Description */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleSection('description')}
                    className="flex w-full items-center justify-between border-b border-gray-200 pb-3 text-left"
                  >
                    <h2 className="text-lg font-bold text-gray-900">
                      Product Description
                    </h2>
                    <svg
                      className={`h-5 w-5 text-gray-600 transition-transform ${
                        expandedSection === 'description'
                          ? 'rotate-180'
                          : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedSection === 'description' && (
                    <p className="mt-4 text-gray-700">
                      Drape yourself in the vibrant elegance of {product.name}.
                      This exquisite vintage piece features a captivating blend
                      of rich colors and intricate patterns that speak to a
                      timeless Nigerian aesthetic. Perfect for adding a touch of
                      sophisticated charm to any outfit, whether casually draped
                      or elegantly tied.
                    </p>
                  )}
                </div>

                {/* Material Details */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleSection('material')}
                    className="flex w-full items-center justify-between border-b border-gray-200 pb-3 text-left"
                  >
                    <h2 className="text-lg font-bold text-gray-900">
                      Material Details
                    </h2>
                    <svg
                      className={`h-5 w-5 text-gray-600 transition-transform ${
                        expandedSection === 'material' ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedSection === 'material' && (
                    <p className="mt-4 text-gray-700">
                      100% Silk. Hand-woven with care and attention to detail.
                    </p>
                  )}
                </div>

                {/* Care Instructions */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleSection('care')}
                    className="flex w-full items-center justify-between border-b border-gray-200 pb-3 text-left"
                  >
                    <h2 className="text-lg font-bold text-gray-900">
                      Care Instructions
                    </h2>
                    <svg
                      className={`h-5 w-5 text-gray-600 transition-transform ${
                        expandedSection === 'care' ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedSection === 'care' && (
                    <p className="mt-4 text-gray-700">
                      Dry clean only. Store flat or rolled to prevent creasing.
                      Keep away from direct sunlight.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Customers Also Viewed */}
            <div className="mt-16">
              <h2 className="mb-8 text-center text-4xl font-bold text-gray-900">
                Customers Also Viewed
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

