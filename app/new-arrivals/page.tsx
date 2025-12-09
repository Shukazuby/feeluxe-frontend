import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { newArrivals } from '../data/products';

export default function NewArrivalsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-5xl font-bold text-gray-900">
              New Arrivals
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-700">
              Discover our latest curated vintage scarves, hand-picked for
              timeless elegance and style.
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-r from-pink-50 via-white to-pink-50 border border-pink-100">
              <div className="grid grid-cols-1 items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-3">
                <div className="lg:col-span-2 text-left">
                  <p className="text-sm uppercase tracking-[0.15em] text-pink-500 font-semibold">
                    Keep exploring
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-gray-900">
                    More vintage treasures await
                  </h2>
                  <p className="mt-3 text-base text-gray-700 max-w-2xl">
                    Browse deeper into our archive. We refresh weekly with rare finds
                    and limited drops—add your favorites to wishlist so you don’t miss out.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/shop-all"
                      className="rounded-lg bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-600 text-center"
                    >
                      Load more arrivals
                    </Link>
                    <Link
                      href="/account"
                      className="rounded-lg border border-pink-200 px-6 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-50 text-center"
                    >
                      View wishlist
                    </Link>
                  </div>
                </div>
                <div className="hidden lg:flex justify-end pr-4">
                  <div className="h-32 w-32 rounded-full bg-pink-100 blur-2xl opacity-70" />
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
