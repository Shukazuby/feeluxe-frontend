import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutUsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[500px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="http://res.cloudinary.com/dkqtwvhq2/image/upload/v1765348757/inflow/images/miee3q1m69s6xjn8edov.png"
              alt="Woman wearing scarf"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative z-10 flex h-full items-center justify-center">
            <div className="text-center text-white">
              <h1 className="mb-4 text-5xl font-bold md:text-6xl">Our Story</h1>
              <p className="text-xl md:text-2xl">
                Discover the passion and heritage woven into every Feeluxe.ng
                scarf.
              </p>
            </div>
          </div>
        </section>

        {/* Beyond a Scarf Section */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-4xl font-bold text-gray-900">
              Beyond a Scarf: A Legacy Reimagined
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                At Feeluxe.ng, we believe that every vintage scarf tells a story
                — a narrative of craftsmanship, culture, and timeless elegance.
                Our journey began with a simple yet profound mission: to bring
                authentic vintage scarves to those who appreciate the beauty of
                heritage and the artistry of the past.
              </p>
              <p>
                Each scarf in our collection is carefully curated, selected not
                just for its aesthetic appeal, but for its unique character and
                the legacy it carries. We travel far and wide, seeking out
                pieces that embody the rich tapestry of Nigerian culture and
                global vintage fashion, ensuring that every item we offer is a
                genuine treasure.
              </p>
              <p>
                Our commitment extends beyond commerce. We are passionate about
                slow fashion and sustainability, giving beautiful vintage pieces
                a new life while honoring the skilled artisans who created them.
                When you choose Feeluxe.ng, you&apos;re not just purchasing a
                scarf — you&apos;re becoming part of a story that spans
                generations.
              </p>
            </div>
          </div>
        </section>

        {/* Our Core Values Section */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Authentic Craftsmanship */}
              <div className="rounded-lg bg-pink-50 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center">
                  <svg
                    className="h-8 w-8 text-pink-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Authentic Craftsmanship
                </h3>
                <p className="text-sm text-gray-700">
                  We celebrate the intricate skills and dedication that went
                  into creating each vintage piece.
                </p>
              </div>

              {/* Nigerian Heritage */}
              <div className="rounded-lg bg-pink-50 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center">
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
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Nigerian Heritage
                </h3>
                <p className="text-sm text-gray-700">
                  Inspired by the rich culture and diverse artistry of Nigeria,
                  reflected in our curated collection.
                </p>
              </div>

              {/* Timeless Elegance */}
              <div className="rounded-lg bg-pink-50 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center">
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
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Timeless Elegance
                </h3>
                <p className="text-sm text-gray-700">
                  Offering pieces that transcend trends, providing enduring
                  style and sophistication.
                </p>
              </div>

              {/* Conscious Luxury */}
              <div className="rounded-lg bg-pink-50 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center">
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
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Conscious Luxury
                </h3>
                <p className="text-sm text-gray-700">
                  Promoting sustainable fashion by giving beautiful vintage
                  pieces a new life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ready to Discover Section */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Ready to Discover Your Next Treasure?
            </h2>
            <p className="mb-8 text-lg text-gray-700">
              Explore our exquisite collection of vintage scarves and find a
              unique piece that speaks to your soul.
            </p>
            <Link
              href="/shop-all"
              className="inline-block rounded-lg bg-pink-500 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-pink-600"
            >
              Explore Our Scarves
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
