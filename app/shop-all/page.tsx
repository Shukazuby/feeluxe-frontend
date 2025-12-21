'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useApi } from '../hooks/useApi';
import { Product, getProductId, getProductPrice } from '../types';

export default function ShopAllPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ShopAllContent />
    </Suspense>
  );
}

function ShopAllContent() {
  const api = useApi();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchTerm = searchParams?.get('search') || '';

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.products.search({ search: searchTerm });
      if (response.success && response.data) {
        setProducts(response.data.data || []);
      } else {
        setError('Failed to load products. Please try again.');
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          // Sort by createdAt if available, otherwise keep original order
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        case 'price-low':
          return getProductPrice(a) - getProductPrice(b);
        case 'price-high':
          return getProductPrice(b) - getProductPrice(a);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return sorted;
  }, [products, sortBy]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-pink-50 py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-5xl font-bold text-gray-900">
              Discover Our Entire Collection
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-700">
              Explore a diverse array of vintage scarves, each with its unique
              story and timeless elegance. Find the perfect piece to complement
              your style.
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-3xl font-bold text-gray-900">All Scarves</h2>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-gray-700">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="text-gray-500">Loading products...</div>
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
                <p className="text-sm text-red-600">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-4 rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
                >
                  Try Again
                </button>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {sortedProducts.map((product) => (
                  <ProductCard key={getProductId(product)} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

