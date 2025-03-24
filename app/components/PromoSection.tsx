import { useState, useEffect } from 'react';

interface Promotion {
  title: string;
  description: string;
  code: string;
  discount: string;
  validUntil: string;
  image: string;
}

const promotions: Promotion[] = [
  {
    title: "Summer Special",
    description: "Get amazing discounts on AC buses",
    code: "SUMMER2024",
    discount: "20% OFF",
    validUntil: "2024-06-30",
    image: "/summer-promo.jpg"
  },
  {
    title: "Family Package",
    description: "Special rates for family bookings",
    code: "FAMILY10",
    discount: "₹500 OFF",
    validUntil: "2024-12-31",
    image: "/family-promo.jpg"
  },
  {
    title: "First Trip",
    description: "Special discount for first-time travelers",
    code: "FIRST50",
    discount: "50% OFF",
    validUntil: "2024-12-31",
    image: "/first-trip.jpg"
  }
];

export default function PromoSection() {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left side - Promotion Details */}
          <div className="mb-10 lg:mb-0">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                {promotions[currentPromo].title}
              </h2>
              <p className="text-xl text-red-100 mb-6">
                {promotions[currentPromo].description}
              </p>
              <div className="inline-flex flex-col items-center lg:items-start">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-4">
                  <p className="text-red-100 text-sm mb-2">Use Code:</p>
                  <div className="flex items-center space-x-3">
                    <code className="text-2xl font-mono text-white font-bold">
                      {promotions[currentPromo].code}
                    </code>
                    <button
                      onClick={() => copyCode(promotions[currentPromo].code)}
                      className="bg-white/20 hover:bg-white/30 transition-colors duration-200 rounded-md p-2"
                      title="Copy code"
                    >
                      {copied ? (
                        <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-bold text-white mb-2">
                    {promotions[currentPromo].discount}
                  </p>
                  <p className="text-red-100">
                    Valid until {new Date(promotions[currentPromo].validUntil).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Promotion Navigation */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/50 to-red-900/50 mix-blend-multiply" />
              <img
                src={promotions[currentPromo].image}
                alt={promotions[currentPromo].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {promotions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPromo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentPromo === index
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to promotion ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-gradient-to-br from-yellow-400 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-gradient-to-br from-blue-400 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
    </div>
  );
} 