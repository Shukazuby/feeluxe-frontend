'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import { useApi } from './hooks/useApi';
import { Product, getProductId } from './types';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Absolutely in love with my scarf from Feeluxe! The quality is amazing, and I get so many compliments. It's like wearing a piece of art.",
    author: "Aisha B.",
    role: "Verified Customer",
    initials: "AB"
  },
  {
    id: 2,
    quote: "The vintage scarves here are truly unique. Each piece tells a story and adds such elegance to my wardrobe. Highly recommend!",
    author: "Chioma O.",
    role: "Verified Customer",
    initials: "CO"
  },
  {
    id: 3,
    quote: "Feeluxe has become my go-to for special occasions. The Nigerian heritage collection is stunning and the quality is exceptional. Perfect gift for my wife!",
    author: "Tunde A.",
    role: "Verified Customer",
    initials: "TA"
  },
  {
    id: 4,
    quote: "I purchased a scarf for my mother's birthday and she was absolutely thrilled! The craftsmanship is outstanding and the colors are vibrant. Will definitely shop here again.",
    author: "Emeka N.",
    role: "Verified Customer",
    initials: "EN"
  },
  {
    id: 5,
    quote: "These scarves are absolutely beautiful! The attention to detail and the way they celebrate our Nigerian culture is remarkable. Every piece feels like a work of art.",
    author: "Folake S.",
    role: "Verified Customer",
    initials: "FS"
  }
];

export default function Home() {
  const api = useApi();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newArrivalsLoading, setNewArrivalsLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.products.getFeatured();
        if (response.success && response.data) {
          // Handle both response.data.data (array) and response.data (object with data property)
          const products = Array.isArray(response.data) 
            ? response.data 
            : response.data.data || [];
          
          // Sort by createdAt (newest first) to ensure latest products come first
          const sortedProducts = products.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA; // Descending order (newest first)
          });
          
          setFeaturedProducts(sortedProducts.slice(0, 4)); // Limit to 4 featured products
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

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await api.products.getNewArrivals();
        if (response.success && response.data) {
          const products = Array.isArray(response.data) 
            ? response.data 
            : response.data.data || [];
          setNewArrivals(products.slice(0, 4)); // Limit to 4 new arrivals
        }
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        setNewArrivals([]);
      } finally {
        setNewArrivalsLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterLoading(true);
    setNewsletterSuccess(false);
    
    try {
      // Add newsletter API call here when available
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setNewsletterSuccess(true);
      setNewsletterEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Swipe handlers for testimonials
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    
    // Calculate and apply real-time swipe offset
    if (touchStart !== null) {
      const diff = touchStart - currentTouch;
      // Limit the swipe offset to prevent over-swiping
      const maxOffset = 100;
      setSwipeOffset(Math.max(-maxOffset, Math.min(maxOffset, -diff)));
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setSwipeOffset(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentTestimonial < testimonials.length - 1) {
      // Swipe left - go to next testimonial
      setSwipeOffset(-200);
      setTimeout(() => {
        setCurrentTestimonial(currentTestimonial + 1);
        setSwipeOffset(0);
      }, 300);
    } else if (isRightSwipe && currentTestimonial > 0) {
      // Swipe right - go to previous testimonial
      setSwipeOffset(200);
      setTimeout(() => {
        setCurrentTestimonial(currentTestimonial - 1);
        setSwipeOffset(0);
      }, 300);
    } else {
      // Snap back if swipe wasn't far enough or at boundaries
      setSwipeOffset(0);
    }
    
    // Reset touch points
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Modern Hero Section - Mobile Optimized */}
        <section className="relative w-full overflow-hidden">
          {/* Mobile: Shorter hero with image on top, Desktop: Full hero */}
          <div className="relative h-[60vh] min-h-[400px] md:h-[75vh] md:min-h-[600px] lg:h-[85vh] lg:min-h-[700px]">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="http://res.cloudinary.com/dkqtwvhq2/image/upload/v1765297289/inflow/images/gj04rs2obbasxynskxa3.jpg"
              alt="Woman wearing scarf"
              fill
              className="object-cover hero-image-animated scale-110"
              priority
            />
            {/* Animated gradient overlay with shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 md:from-black/40 md:via-black/30 md:to-black/50"></div>
            {/* Subtle shimmer overlay */}
            <div className="absolute inset-0 hero-overlay-shimmer opacity-30"></div>
            {/* Animated light rays effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shimmer"></div>
          </div>
            
            {/* Content Container */}
            <div className="relative z-10 flex h-full items-center justify-center px-4 md:px-6">
              <div className="text-center text-white max-w-4xl w-full">
                {/* Badge */}
                <div className="mb-4 md:mb-6 inline-block">
                  <span className="text-xs md:text-sm font-medium tracking-wider uppercase text-pink-200 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    Timeless Luxury
                  </span>
          </div>
                
                {/* Heading - Smaller on mobile */}
                <h1 className="mb-4 md:mb-6 text-3xl font-light tracking-tight sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl">
                  Drape Yourself in
                  <span className="block mt-1 md:mt-2 font-serif italic text-pink-300">Elegance</span>
              </h1>
                
                {/* Description - Shorter on mobile */}
                <p className="mb-6 md:mb-10 text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed px-2">
                  Discover authentic vintage scarves celebrating Nigerian heritage with timeless sophistication.
                </p>
                
                {/* CTA Buttons - Stacked on mobile, side-by-side on desktop */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
              <Link
                href="/shop-all"
                    className="group relative overflow-hidden rounded-full bg-white px-6 py-3 md:px-10 md:py-4 text-sm md:text-base font-medium text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full sm:w-auto"
                  >
                    <span className="relative z-10">Shop</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    href="/new-arrivals"
                    className="rounded-full border-2 border-white px-6 py-3 md:px-10 md:py-4 text-sm md:text-base font-medium text-white transition-all duration-300 hover:bg-white hover:text-gray-900 w-full sm:w-auto"
                  >
                    New Arrivals
              </Link>
                </div>
              </div>
            </div>
            
            {/* Scroll Indicator - Hidden on mobile, shown on desktop */}
            <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* Featured Products Section - Modern Design */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-medium tracking-wider uppercase text-pink-500 mb-4 block">
                Featured Collection
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              Our Featured Scarves
            </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto"></div>
            </div>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading featured products...</span>
                </div>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product, index) => (
                  <div 
                    key={getProductId(product)} 
                    className="group opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg">No featured products available at the moment.</p>
                <Link href="/shop-all" className="mt-4 inline-block text-pink-500 hover:text-pink-600">
                  Browse all products →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-16">
              <div className="text-left">
                <span className="text-sm font-medium tracking-wider uppercase text-pink-500 mb-4 block">
                  Latest Collection
                </span>
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                  New Arrivals
                </h2>
                <div className="w-24 h-0.5 bg-gradient-to-r from-pink-400 to-transparent"></div>
              </div>
              <Link
                href="/new-arrivals"
                className="hidden md:flex items-center gap-2 text-pink-500 font-medium hover:text-pink-600 transition-colors"
              >
                View All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            {newArrivalsLoading ? (
              <div className="flex justify-center py-20">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading new arrivals...</span>
                </div>
              </div>
            ) : newArrivals.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {newArrivals.map((product, index) => (
                  <div 
                    key={getProductId(product)} 
                    className="group opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg">No new arrivals at the moment.</p>
                <Link href="/shop-all" className="mt-4 inline-block text-pink-500 hover:text-pink-600">
                  Browse all products →
                </Link>
              </div>
            )}
            <div className="mt-8 text-center md:hidden">
              <Link
                href="/new-arrivals"
                className="inline-flex items-center gap-2 text-pink-500 font-medium hover:text-pink-600"
              >
                View All New Arrivals
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-medium tracking-wider uppercase text-pink-500 mb-4 block">
                Why Feeluxe
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                What Makes Us Special
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentic Vintage</h3>
                <p className="text-gray-600 leading-relaxed">
                  Each piece is carefully authenticated and sourced from trusted vintage collections.
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  Hand-selected scarves made from the finest materials, ensuring lasting elegance.
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Nigerian Heritage</h3>
                <p className="text-gray-600 leading-relaxed">
                  Celebrating the rich cultural heritage and vibrant artistry of Nigeria.
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Curated Collection</h3>
                <p className="text-gray-600 leading-relaxed">
                  Expertly curated pieces that add timeless elegance to your personal style.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Heritage Section - Redesigned */}
        <section className="py-20 md:py-28 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 via-purple-50/20 to-transparent"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <span className="text-sm font-medium tracking-wider uppercase text-pink-500">
                  Our Story
                </span>
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                  Inspired by Heritage,
                  <span className="block font-serif italic text-pink-400 mt-2">Crafted for You</span>
                </h2>
                <p className="text-lg leading-relaxed text-gray-600 max-w-lg">
                  Feeluxe.ng brings you authentic vintage scarves, celebrating
                  timeless luxury and our rich Nigerian heritage. Each piece is
                  carefully selected to add a touch of elegance to your personal
                  style.
                </p>
                <div className="pt-4">
                  <Link
                    href="/shop-all"
                    className="inline-flex items-center gap-2 text-pink-500 font-medium hover:text-pink-600 transition-colors"
                  >
                    Explore Collection
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <div className="mb-4 aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:shadow-xl">
                    <Image
                      src="http://res.cloudinary.com/dkqtwvhq2/image/upload/v1765348359/inflow/images/lfpajsbbbheq7vw7occq.png"
                      alt="Authentic Vintage"
                      width={400}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    Authentic Vintage
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Each scarf is a genuine vintage find, offering a unique
                    piece of history.
                  </p>
                </div>
                <div className="group mt-8">
                  <div className="mb-4 aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:shadow-xl">
                    <Image
                      src="http://res.cloudinary.com/dkqtwvhq2/image/upload/v1765348526/inflow/images/lqxw2tcl9ym7iihdhmv5.png"
                      alt="Nigerian Heritage"
                      width={400}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    Nigerian Heritage
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Our collection is inspired by the vibrant culture and
                    artistry of Nigeria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Highlights Section */}
        <section className="py-20 bg-white border-y border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Discount</h3>
                  <p className="text-gray-600">On orders over via our website</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Returns</h3>
                  <p className="text-gray-600">30-day return policy for your peace of mind</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment</h3>
                  <p className="text-gray-600">Safe and secure payment processing</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-medium tracking-wider uppercase text-pink-500 mb-4 block">
                Stay Connected
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                Join Our Newsletter
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Be the first to know about new arrivals, exclusive offers, and style tips.
              </p>
            </div>
            {newsletterSuccess ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600">You've successfully subscribed to our newsletter.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  />
                  <button
                    type="submit"
                    disabled={newsletterLoading}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {newsletterLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Subscribing...
                      </span>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Testimonials Section - Modern Design */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="text-sm font-medium tracking-wider uppercase text-pink-500 mb-4 block">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-12">
              What Our Customers Are Saying
            </h2>
            <div 
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 select-none cursor-grab active:cursor-grabbing transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${swipeOffset}px)` }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
            <div className="mb-6 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                    className="h-6 w-6 text-pink-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
              <blockquote className="mb-6 text-xl md:text-2xl italic text-gray-700 leading-relaxed">
                &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
            </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center text-white font-semibold">
                  {testimonials[currentTestimonial].initials}
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-900">{testimonials[currentTestimonial].author}</p>
                  <p className="text-sm text-gray-500">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentTestimonial
                      ? 'w-8 h-2 bg-pink-500'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Ready to Elevate Your Style?
            </h2>
            <p className="text-xl text-pink-100 mb-10 max-w-2xl mx-auto">
              Join thousands of customers who have discovered the elegance of Feeluxe scarves.
            </p>
            <Link
              href="/shop-all"
              className="inline-block rounded-full bg-white px-10 py-4 text-base font-medium text-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Start Shopping
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
