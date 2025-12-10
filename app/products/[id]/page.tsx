'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { useAuth } from '../../components/AuthProvider';
import { useApi } from '../../hooks/useApi';
import { Product, getProductId, getProductPrice, getProductImage } from '../../types';
import { guestCart, guestWishlist } from '../../lib/guestStorage';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { requireAuth, isAuthenticated } = useAuth();
  const api = useApi();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'description'
  );
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productId = typeof params.id === 'string' ? params.id : params.id?.[0] || '';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch product details
        const productResponse = await api.products.getById(productId);
        if (productResponse.success && productResponse.data) {
          setProduct(productResponse.data);
          
          // Fetch featured products for "Customers Also Viewed" section
          const featuredResponse = await api.products.getFeatured();
          if (featuredResponse.success && featuredResponse.data) {
            const featured = featuredResponse.data.data || [];
            // Filter out current product
            let filtered = featured.filter((p: Product) => getProductId(p) !== productId);
            
            // If we have fewer than 4 after filtering, try to get more products
            if (filtered.length < 4) {
              try {
                const allProductsResponse = await api.products.getAll({ limit: 20 });
                if (allProductsResponse.success && allProductsResponse.data) {
                  const allProducts = allProductsResponse.data.data || [];
                  // Add products that aren't already in filtered and aren't the current product
                  const additionalProducts = allProducts
                    .filter((p: Product) => {
                      const pid = getProductId(p);
                      return pid !== productId && !filtered.some((fp: Product) => getProductId(fp) === pid);
                    })
                    .slice(0, 4 - filtered.length);
                  filtered = [...filtered, ...additionalProducts];
                }
              } catch (err) {
                console.error('Error fetching additional products:', err);
              }
            }
            
            // Limit to 4 products
            setRelatedProducts(filtered.slice(0, 4));
          }
        } else {
          setError('Product not found');
        }
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Check wishlist status when product loads and user is authenticated
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !productId) return;

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
      }
    };

    checkWishlistStatus();
  }, [isAuthenticated, productId]);

  const handleWishlist = async () => {
    if (!productId || !product) return;
    if (!isAuthenticated) {
      setWishlistLoading(true);
      if (wishlisted) {
        guestWishlist.remove(productId);
        setWishlisted(false);
      } else {
        guestWishlist.add(product);
        setWishlisted(true);
      }
      setWishlistLoading(false);
      return;
    }

    requireAuth(async () => {
      if (!productId) return;
      setWishlistLoading(true);
      try {
        if (wishlisted) {
          await api.customers.removeFromWishlist(productId);
          setWishlisted(false);
        } else {
          await api.customers.addToWishlist({ productId });
          setWishlisted(true);
        }
      } catch (error) {
        console.error('Error updating wishlist:', error);
      } finally {
        setWishlistLoading(false);
      }
    });
  };

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

  const handleAddToCart = async () => {
    if (!productId || !product) return;
    if (!isAuthenticated) {
      guestCart.add(product, 1);
      router.push('/cart');
      return;
    }

    requireAuth(async () => {
      try {
        await api.cart.addToCart({
          productId,
          quantity: 1,
        });
        setTimeout(() => {
          router.push('/cart');
        }, 100);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center py-12">
                <div className="text-gray-500">Loading product...</div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  {error || 'Product not found'}
                </p>
                <button
                  onClick={() => router.push('/shop-all')}
                  className="rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-600"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const productImage = getProductImage(product);
  const productPrice = getProductPrice(product);

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
                    src={productImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {relatedProducts.length > 0 && (
                  <div className="mt-4 flex gap-4">
                    {relatedProducts.map((p, index) => {
                      const relatedImage = getProductImage(p);
                      return (
                        <button
                          key={getProductId(p)}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                            selectedImageIndex === index
                              ? 'border-pink-500'
                              : 'border-gray-200'
                          }`}
                        >
                          <Image
                            src={relatedImage}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column - Product Details */}
              <div>
                <h1 className="mb-4 text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="mb-6 text-3xl font-semibold text-pink-500">
                  {formatPrice(productPrice)}
                </p>
                <div className="mb-8 flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:from-pink-600 hover:to-pink-700"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleWishlist}
                    disabled={wishlistLoading}
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 transition-colors disabled:opacity-50 ${
                      wishlisted
                        ? 'border-pink-500 bg-pink-50 text-pink-500'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-pink-300 hover:text-pink-500'
                    }`}
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <svg
                      className="h-6 w-6"
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
                      {product.description || `Drape yourself in the vibrant elegance of ${product.name}. This exquisite vintage piece features a captivating blend of rich colors and intricate patterns that speak to a timeless Nigerian aesthetic. Perfect for adding a touch of sophisticated charm to any outfit, whether casually draped or elegantly tied.`}
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
                  <ProductCard key={getProductId(p)} product={p} />
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

