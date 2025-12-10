'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import { useApi } from './hooks/useApi';
import { Product, getProductId } from './types';

export default function Home() {
  const api = useApi();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.products.getFeatured();
        if (response.success && response.data) {
          // Handle both response.data.data (array) and response.data (object with data property)
          const products = Array.isArray(response.data) 
            ? response.data 
            : response.data.data || [];
          setFeaturedProducts(products.slice(0, 4)); // Limit to 4 featured products
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback to empty array on error
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="http://res.cloudinary.com/dkqtwvhq2/image/upload/v1765297289/inflow/images/gj04rs2obbasxynskxa3.jpg"
              alt="Woman wearing scarf"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          <div className="relative z-10 flex h-full items-center justify-center">
            <div className="text-center text-white">
              <h1 className="mb-4 text-5xl font-bold md:text-6xl">
                Drape Yourself in Luxury
              </h1>
              <p className="mb-8 text-xl md:text-2xl">
                Discover Our Curated Collection of Vintage Scarves
              </p>
              <Link
                href="/shop-all"
                className="inline-block rounded-lg bg-pink-400 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-pink-500"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Scarves Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
              Our Featured Scarves
            </h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="text-gray-500">Loading featured products...</div>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={getProductId(product)} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No featured products available at the moment.
              </div>
            )}
          </div>
        </section>

        {/* Heritage Section */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 text-4xl font-bold text-gray-900">
                  Inspired by Heritage, Crafted for You
                </h2>
                <p className="text-lg leading-relaxed text-gray-700">
                  Feeluxe.ng brings you authentic vintage scarves, celebrating
                  timeless luxury and our rich Nigerian heritage. Each piece is
                  carefully selected to add a touch of elegance to your personal
                  style.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-200">
                    <Image
                      src="http://res.cloudinary.com/dkqtwvhq2/image/upload/v1765348359/inflow/images/lfpajsbbbheq7vw7occq.png"
                      alt="Authentic Vintage"
                      width={300}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Authentic Vintage
                  </h3>
                  <p className="text-sm text-gray-600">
                    Each scarf is a genuine vintage find, offering a unique
                    piece of history.
                  </p>
                </div>
                <div>
                  <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-200">
                    <Image
                      src="http://res.cloudinary.com/dkqtwvhq2/image/upload/v1765348526/inflow/images/lqxw2tcl9ym7iihdhmv5.png"
                      alt="Nigerian Heritage"
                      width={300}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Nigerian Heritage
                  </h3>
                  <p className="text-sm text-gray-600">
                    Our collection is inspired by the vibrant culture and
                    artistry of Nigeria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-8 text-4xl font-bold text-gray-900">
              What Our Customers Are Saying
            </h2>
            <div className="mb-6 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="h-6 w-6 text-pink-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="mb-4 text-xl italic text-gray-700">
              &ldquo;Absolutely in love with my scarf from Feeluxe! The quality
              is amazing, and I get so many compliments. It&apos;s like wearing
              a piece of art.&rdquo;
            </blockquote>
            <p className="text-lg font-medium text-gray-900">- Aisha B.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
