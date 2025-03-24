'use client';

import { useState } from 'react';
import { useTheme } from '../components/ThemeProvider';

interface Offer {
  id: string;
  title: string;
  code: string;
  discount: string;
  validUntil: string;
  description: string;
  terms: string[];
}

const offers: Offer[] = [
  {
    id: '1',
    title: 'First Trip Discount',
    code: 'FIRST50',
    discount: '50% OFF',
    validUntil: '2024-04-30',
    description: 'Get 50% off on your first bus booking',
    terms: [
      'Valid for first-time users only',
      'Maximum discount: ₹500',
      'Valid on all bus types'
    ]
  },
  {
    id: '2',
    title: 'Weekend Special',
    code: 'WEEKEND20',
    discount: '20% OFF',
    validUntil: '2024-12-31',
    description: 'Special weekend discount on all AC buses',
    terms: [
      'Valid only on weekends',
      'Maximum discount: ₹300',
      'Valid on AC buses only'
    ]
  },
  {
    id: '3',
    title: 'Student Discount',
    code: 'STUDENT25',
    discount: '25% OFF',
    validUntil: '2024-12-31',
    description: 'Special discount for students with valid ID',
    terms: [
      'Valid student ID required',
      'Maximum discount: ₹400',
      'Valid on all routes'
    ]
  },
  {
    id: '4',
    title: 'Senior Citizen Offer',
    code: 'SENIOR30',
    discount: '30% OFF',
    validUntil: '2024-12-31',
    description: 'Special discount for senior citizens',
    terms: [
      'Age proof required (60+ years)',
      'Maximum discount: ₹500',
      'Valid on all bus types'
    ]
  }
];

export default function OffersPage() {
  const { theme } = useTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Current Offers & Deals
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div key={offer.id} className="card hover:shadow-xl transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {offer.title}
                </h2>
                <p className="text-3xl font-bold text-[var(--primary-color)]">
                  {offer.discount}
                </p>
              </div>
              <div className="bg-[var(--primary-color)] text-white px-3 py-1 rounded-full text-sm">
                {offer.code}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {offer.description}
            </p>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Terms & Conditions:
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                {offer.terms.map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Valid until: {new Date(offer.validUntil).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleCopyCode(offer.code)}
                className="btn-primary"
              >
                {copiedCode === offer.code ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 card text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Subscribe for More Offers
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Get notified about new deals and exclusive offers directly in your inbox!
        </p>
        <div className="flex max-w-md mx-auto gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="input flex-1"
          />
          <button className="btn-primary">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
} 