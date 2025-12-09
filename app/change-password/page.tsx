import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ChangePasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-16">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-12 text-center text-4xl font-bold text-gray-900">
              Change Your Password
            </h1>

            <div className="rounded-lg bg-white p-8 shadow-md">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="current-password"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    name="current-password"
                    placeholder="Enter your current password"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    name="new-password"
                    placeholder="Enter your new password"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    placeholder="Confirm your new password"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-3 font-bold text-white transition-colors hover:from-pink-600 hover:to-pink-700"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

