import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ShippingReturnsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-10 text-center text-4xl font-bold text-gray-900">
              Shipping & Returns
            </h1>

            <div className="space-y-8">
              <div className="rounded-2xl border border-pink-100 bg-pink-50 px-6 py-6 shadow-sm sm:px-8 sm:py-8">
                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Information
                </h2>
                <p className="mt-4 text-sm leading-6 text-gray-700">
                  At Feeluxe.ng, we are committed to delivering your vintage
                  scarves with care and efficiency. We offer reliable shipping
                  services across Nigeria.
                </p>

                <div className="mt-6 space-y-4 text-sm leading-6 text-gray-800">
                  <div>
                    <h3 className="font-semibold text-gray-900">Processing Time:</h3>
                    <p className="mt-1">
                      Orders are typically processed and dispatched within 1–3
                      business days. Processing may extend during sales or
                      public holidays.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Shipping Methods & Delivery Times:
                    </h3>
                    <ul className="mt-1 list-disc space-y-2 pl-5">
                      <li>
                        <strong>Standard Shipping (Nationwide):</strong>{' '}
                        Estimated delivery within 3–7 business days after
                        dispatch.
                      </li>
                      <li>
                        <strong>Express Shipping (Select Cities):</strong>{' '}
                        Estimated delivery within 1–3 business days after
                        dispatch. Availability and cost may vary by location.
                      </li>
                    </ul>
                  </div>

                  <p>
                    Shipping costs are calculated at checkout based on your
                    address and chosen method. A tracking number will be emailed
                    once your order ships.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-pink-100 bg-pink-50 px-6 py-6 shadow-sm sm:px-8 sm:py-8">
                <h2 className="text-xl font-semibold text-gray-900">
                  Return Policy
                </h2>
                <p className="mt-4 text-sm leading-6 text-gray-700">
                  Your satisfaction is important to us. If you are not entirely
                  happy with your Feeluxe.ng purchase, we&apos;re here to help.
                </p>

                <div className="mt-6 space-y-4 text-sm leading-6 text-gray-800">
                  <div>
                    <h3 className="font-semibold text-gray-900">Eligibility:</h3>
                    <ul className="mt-1 list-disc space-y-2 pl-5">
                      <li>Items must be returned within 7 days of delivery.</li>
                      <li>
                        Items must be unused, unwashed, and in the same condition
                        received.
                      </li>
                      <li>Original tags and packaging must be intact.</li>
                      <li>Proof of purchase (order number or receipt) is required.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Non–Returnable Items:
                    </h3>
                    <p className="mt-1">
                      Due to the vintage nature of our products, some items may be
                      non-returnable. Sale items are final sale and cannot be
                      returned or exchanged.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Return Process:</h3>
                    <ol className="mt-1 list-decimal space-y-2 pl-5">
                      <li>
                        Contact support at{' '}
                        <a
                          href="mailto:support@feeluxe.ng"
                          className="text-pink-500 hover:text-pink-600"
                        >
                          support@feeluxe.ng
                        </a>{' '}
                        with your order number and reason.
                      </li>
                      <li>
                        We will provide instructions and a return shipping address.
                      </li>
                      <li>
                        Customers are responsible for return shipping costs; a
                        trackable service is recommended.
                      </li>
                      <li>
                        After inspection, we&apos;ll notify you of approval or
                        rejection.
                      </li>
                      <li>
                        Approved refunds will be processed to the original payment
                        method.
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-pink-100 bg-pink-50 px-6 py-6 shadow-sm sm:px-8 sm:py-8">
                <h2 className="text-xl font-semibold text-gray-900">Exchanges</h2>
                <p className="mt-4 text-sm leading-6 text-gray-700">
                  Due to the unique, one-of-a-kind nature of our vintage scarves,
                  we generally do not offer direct exchanges. To exchange an item,
                  please follow the return process above for a refund and place a
                  new order for your desired scarf.
                </p>
                <p className="mt-3 text-sm leading-6 text-gray-700">
                  If you received a damaged or defective item, contact us at{' '}
                  <a
                    href="mailto:support@feeluxe.ng"
                    className="text-pink-500 hover:text-pink-600"
                  >
                    support@feeluxe.ng
                  </a>{' '}
                  with photos of the defect for a suitable resolution.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

