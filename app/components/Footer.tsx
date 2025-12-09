import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-pink-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-pink-500"></div>
              <span className="text-xl font-semibold text-black">
                Feeluxe.ng
              </span>
            </Link>
            <p className="text-sm text-gray-600">
              Timeless luxury, inspired by heritage.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-black">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faqs"
                  className="text-sm text-gray-600 hover:text-pink-500"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-returns"
                  className="text-sm text-gray-600 hover:text-pink-500"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-600 hover:text-pink-500"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-black">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about-us"
                  className="text-sm text-gray-600 hover:text-pink-500"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-pink-500"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-black">
              Join Our Newsletter
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Get exclusive offers and style tips.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="rounded bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-pink-200 pt-8 text-center">
          <p className="text-sm text-gray-600">
            © 2024 Feeluxe.ng. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

