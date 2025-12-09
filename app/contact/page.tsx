'use client';

import { useState, FormEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { contactApi } from '../lib/api/contact';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const response = await contactApi.create({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (response.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(response.message || 'Failed to send message. Please try again.');
      }
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 bg-gray-100">
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Title and Description */}
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-5xl font-bold text-gray-900">
                Contact Us
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-700">
                We&apos;d love to hear from you! Whether you have a question
                about our vintage scarves, need assistance with an order, or
                just want to share your thoughts, feel free to reach out.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left: Send us a Message */}
              <div className="rounded-lg bg-white p-8 shadow-sm">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Success Message */}
                  {success && (
                    <div className="rounded-lg bg-green-50 p-4 text-green-800">
                      <p className="font-medium">Message sent successfully! We&apos;ll get back to you soon.</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-red-800">
                      <p className="font-medium">{error}</p>
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="w-full rounded border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                      className="w-full rounded border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Subject"
                      required
                      className="w-full rounded border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      rows={6}
                      required
                      className="w-full resize-none rounded border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-3 font-semibold text-white transition-colors hover:from-pink-600 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Right: Our Contact Information */}
              <div className="rounded-lg bg-white p-8 shadow-sm">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Our Contact Information
                </h2>
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100">
                      <svg
                        className="h-5 w-5 text-pink-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Email:
                      </p>
                      <a
                        href="mailto:support@feeluxe.ng"
                        className="text-gray-900 hover:text-pink-500"
                      >
                        support@feeluxe.ng
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100">
                      <svg
                        className="h-5 w-5 text-pink-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Phone:
                      </p>
                      <a
                        href="tel:+2348012345678"
                        className="text-gray-900 hover:text-pink-500"
                      >
                        +234 801 234 5678
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100">
                      <svg
                        className="h-5 w-5 text-pink-500"
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
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Address:
                      </p>
                      <p className="text-gray-900">
                        123 Luxury Lane, Victoria Island, Lagos, Nigeria
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connect With Us */}
                <div className="mt-8">
                  <h3 className="mb-4 text-xl font-bold text-gray-900">
                    Connect With Us
                  </h3>
                  <div className="flex gap-4">
                    {[...Array(3)].map((_, i) => (
                      <a
                        key={i}
                        href="#"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-white transition-colors hover:bg-pink-600"
                        aria-label={`Social media ${i + 1}`}
                      >
                        <span className="text-lg font-semibold">@</span>
                      </a>
                    ))}
                  </div>
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
