import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PaymentConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Payment Successful
            </h1>
            <p className="mt-3 text-gray-700">
              Thank you for your purchase. Your payment has been confirmed.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

