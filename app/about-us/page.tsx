'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutUsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Animated Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="http://res.cloudinary.com/dkqtwvhq2/image/upload/v1765348757/inflow/images/miee3q1m69s6xjn8edov.png"
              alt="Woman wearing scarf"
              fill
              className="object-cover hero-image-animated scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 md:from-black/50 md:via-black/40 md:to-black/60"></div>
            <div className="absolute inset-0 hero-overlay-shimmer opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shimmer"></div>
          </div>
          <div className="relative z-10 flex h-full items-center justify-center px-4">
            <div className="text-center text-white max-w-4xl">
              <div className="mb-6 inline-block">
                <span className="text-sm font-medium tracking-wider uppercase text-pink-200 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  Our Journey
                </span>
              </div>
              <h1 className="mb-6 text-4xl font-light tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Our Story
                <span className="block mt-2 font-serif italic text-pink-300">Heritage & Elegance</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed">
                Discover the passion and heritage woven into every Feeluxe.ng scarf.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                <span className="text-sm font-medium tracking-wider uppercase text-pink-500 mb-4 block">
                  Our Mission
                </span>
                <h2 className="mb-6 text-3xl md:text-4xl font-light text-gray-900">
              Beyond a Scarf: A Legacy Reimagined
            </h2>
                <p className="text-lg leading-relaxed text-gray-700 mb-4">
                At Feeluxe.ng, we believe that every vintage scarf tells a story
                — a narrative of craftsmanship, culture, and timeless elegance.
                Our journey began with a simple yet profound mission: to bring
                authentic vintage scarves to those who appreciate the beauty of
                heritage and the artistry of the past.
              </p>
                <p className="text-lg leading-relaxed text-gray-700">
                Each scarf in our collection is carefully curated, selected not
                just for its aesthetic appeal, but for its unique character and
                the legacy it carries. We travel far and wide, seeking out
                  pieces that embody the rich tapestry of Nigerian culture.
                </p>
              </div>
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                <span className="text-sm font-medium tracking-wider uppercase text-pink-500 mb-4 block">
                  Our Vision
                </span>
                <h2 className="mb-6 text-3xl md:text-4xl font-light text-gray-900">
                  Timeless Elegance for Generations
                </h2>
                <p className="text-lg leading-relaxed text-gray-700 mb-4">
                  We envision a world where fashion honors heritage, where every
                  piece tells a story, and where sustainability meets sophistication.
                  Our commitment extends beyond commerce — we are passionate about
                  slow fashion and sustainability.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                When you choose Feeluxe.ng, you&apos;re not just purchasing a
                scarf — you&apos;re becoming part of a story that spans
                  generations, celebrating the artistry of skilled craftspeople
                  and the vibrant culture of Nigeria.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-medium tracking-wider uppercase text-pink-500 mb-4 block">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                What Makes Us Different
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Curated Selection</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every scarf is handpicked by our expert curators, ensuring only the finest vintage pieces make it to our collection.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Authenticity Guaranteed</h3>
                <p className="text-gray-600 leading-relaxed">
                  We verify the authenticity and provenance of every piece, so you can shop with confidence knowing you're getting genuine vintage.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-0 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Touch</h3>
                <p className="text-gray-600 leading-relaxed">
                  We provide personalized styling advice and care instructions, ensuring your vintage scarf becomes a cherished part of your wardrobe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Journey Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-medium tracking-wider uppercase text-pink-500 mb-4 block">
                Our Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                How We Started
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto"></div>
            </div>
            <div className="space-y-8">
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center text-white font-semibold text-lg">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">The Beginning</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Founded with a passion for preserving Nigerian heritage through fashion,
                      Feeluxe.ng began as a small collection of carefully sourced vintage scarves.
                    </p>
                  </div>
                </div>
              </div>
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center text-white font-semibold text-lg">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Curating Excellence</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We developed relationships with trusted vintage collectors and artisans,
                      ensuring every piece meets our standards of authenticity and quality.
                    </p>
                  </div>
                </div>
              </div>
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center text-white font-semibold text-lg">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Growing Community</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Today, we serve thousands of customers who share our appreciation for
                      timeless elegance and sustainable fashion, building a community of style
                      enthusiasts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Core Values Section - Redesigned */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-medium tracking-wider uppercase text-pink-500 mb-4 block">
                What We Stand For
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              Our Core Values
            </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Authentic Craftsmanship */}
              <div className="group text-center opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="h-8 w-8 text-pink-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Authentic Craftsmanship
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  We celebrate the intricate skills and dedication that went
                  into creating each vintage piece.
                </p>
              </div>

              {/* Nigerian Heritage */}
              <div className="group text-center opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="h-8 w-8 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Nigerian Heritage
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  Inspired by the rich culture and diverse artistry of Nigeria,
                  reflected in our curated collection.
                </p>
              </div>

              {/* Timeless Elegance */}
              <div className="group text-center opacity-0 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="h-8 w-8 text-pink-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Timeless Elegance
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  Offering pieces that transcend trends, providing enduring
                  style and sophistication.
                </p>
              </div>

              {/* Conscious Luxury */}
              <div className="group text-center opacity-0 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="h-8 w-8 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Conscious Luxury
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  Promoting sustainable fashion by giving beautiful vintage
                  pieces a new life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                <span className="text-sm font-medium tracking-wider uppercase text-pink-500 mb-4 block">
                  Our Commitment
                </span>
                <h2 className="mb-6 text-3xl md:text-4xl font-light text-gray-900">
                  Sustainable Fashion,
                  <span className="block font-serif italic text-pink-400 mt-2">Timeless Style</span>
                </h2>
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  We believe in slow fashion and sustainability. Every vintage scarf
                  we offer is given a new life, reducing waste while celebrating the
                  artistry of skilled craftspeople from generations past.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">100% authentic vintage pieces</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Eco-friendly packaging and shipping</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Supporting local artisans and communities</p>
                  </div>
                </div>
              </div>
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-xl">
                  <Image
                    src="http://res.cloudinary.com/dkqtwvhq2/image/upload/v1765348359/inflow/images/lfpajsbbbheq7vw7occq.png"
                    alt="Sustainable fashion"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Redesigned */}
        <section className="py-20 md:py-28 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-6 text-4xl md:text-5xl font-light">
              Ready to Discover Your Next Treasure?
            </h2>
            <p className="mb-10 text-xl text-pink-100 max-w-2xl mx-auto">
              Explore our exquisite collection of vintage scarves and find a
              unique piece that speaks to your soul.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop-all"
                className="inline-block rounded-full bg-white px-10 py-4 text-base font-medium text-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Explore Collection
              </Link>
              <Link
                href="/new-arrivals"
                className="inline-block rounded-full border-2 border-white px-10 py-4 text-base font-medium text-white transition-all duration-300 hover:bg-white hover:text-pink-600"
              >
                New Arrivals
            </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
