import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 text-sm text-gray-600">
              Last updated: June 1, 2024
            </div>
            <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
              Privacy Policy
            </h1>

            <div className="space-y-8 text-sm leading-7 text-gray-800">
              <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Introduction
                </h2>
                <p>
                  Welcome to Feeluxe.ng. We are committed to protecting your
                  privacy and ensuring you have a positive experience on our
                  website. This Privacy Policy outlines how we collect, use,
                  disclose, and safeguard your information when you visit
                  Feeluxe.ng. Please read this policy carefully. If you do not
                  agree with the terms, please do not access the Site.
                </p>
                <p className="mt-3">
                  We reserve the right to make changes to this Privacy Policy at
                  any time. Updates will be posted on this page, and your
                  continued use of the Site after changes are posted constitutes
                  acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Information We Collect
                </h2>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong>Personal Data:</strong> Name, email, shipping
                    address, phone number, and other identifiers you provide.
                  </li>
                  <li>
                    <strong>Derivative Data:</strong> IP address, browser type,
                    operating system, access times, and pages viewed.
                  </li>
                  <li>
                    <strong>Financial Data:</strong> Payment information
                    collected during checkout (processed securely by payment
                    partners).
                  </li>
                  <li>
                    <strong>Data from Social Networks:</strong> Information from
                    social accounts if you choose to connect them.
                  </li>
                  <li>
                    <strong>Mobile Device Data:</strong> Device information and
                    location (if you access from a mobile device).
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  How We Use Your Information
                </h2>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Create and manage your account.</li>
                  <li>Process orders, payments, and refunds.</li>
                  <li>Deliver products and services to you.</li>
                  <li>Communicate updates and respond to support requests.</li>
                  <li>Send personalized offers and recommendations.</li>
                  <li>Improve site performance and user experience.</li>
                  <li>Monitor usage and analyze trends.</li>
                  <li>Prevent fraud and enhance security.</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Disclosure of Your Information
                </h2>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong>By Law or to Protect Rights:</strong> If required to
                    comply with legal obligations or protect rights, property,
                    and safety.
                  </li>
                  <li>
                    <strong>Third-Party Service Providers:</strong> For payment
                    processing, delivery, analytics, and marketing support.
                  </li>
                  <li>
                    <strong>Marketing Communications:</strong> With your
                    consent, for marketing or promotional purposes.
                  </li>
                  <li>
                    <strong>Affiliates and Business Partners:</strong> To offer
                    joint products or services, subject to this policy.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Security of Your Information
                </h2>
                <p>
                  We use administrative, technical, and physical security
                  measures to help protect your personal information. While we
                  strive to safeguard data, no method of transmission is 100%
                  secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Contact Us
                </h2>
                <p>
                  If you have questions or comments about this Privacy Policy,
                  please contact us at{' '}
                  <a
                    href="mailto:support@feeluxe.ng"
                    className="text-pink-500 hover:text-pink-600"
                  >
                    support@feeluxe.ng
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

