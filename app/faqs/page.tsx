'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSection = {
  title: string;
  items: FAQItem[];
};

const sections: FAQSection[] = [
  {
    title: 'Ordering',
    items: [
      {
        question: 'How do I place an order?',
        answer:
          'Browse our collection, add your favorite scarves to cart, and proceed to checkout. Complete your shipping details and payment to confirm.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept major debit/credit cards and secure online payment options. All payments are processed over encrypted connections.',
      },
      {
        question: 'Can I modify or cancel my order?',
        answer:
          'You can request modifications or cancellations before the order ships. Contact us as soon as possible with your order number.',
      },
    ],
  },
  {
    title: 'Shipping',
    items: [
      {
        question: 'What are your shipping options and delivery times?',
        answer:
          'Standard shipping typically arrives in 3–7 business days after dispatch. Express options may be available at checkout.',
      },
      {
        question: 'How can I track my order?',
        answer:
          'Once your order ships, you will receive a tracking number via email to follow your delivery in real time.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'We primarily ship within Nigeria. For international requests, please contact support to confirm availability.',
      },
    ],
  },
  {
    title: 'Returns & Exchanges',
    items: [
      {
        question: 'What is your return policy?',
        answer:
          'Items can be returned within 7 days of delivery if unused, unwashed, and in original condition with tags and packaging.',
      },
      {
        question: 'How do I initiate a return or exchange?',
        answer:
          'Reach out to support@feeluxe.ng with your order number and reason. We will guide you through return shipping steps.',
      },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h1>

            <div className="mb-10 flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full border-none text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-10">
              {sections.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.items.map((item) => {
                      const key = `${section.title}-${item.question}`;
                      const isOpen = !!open[key];
                      return (
                        <div
                          key={key}
                          className="overflow-hidden rounded-lg bg-pink-50"
                        >
                          <button
                            onClick={() => toggle(key)}
                            className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-semibold text-gray-900"
                          >
                            {item.question}
                            <span className="text-lg text-pink-500">
                              {isOpen ? '−' : '+'}
                            </span>
                          </button>
                          {isOpen && (
                            <div className="border-t border-pink-100 px-4 py-3 text-sm text-gray-700">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

