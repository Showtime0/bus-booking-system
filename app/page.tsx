import Link from 'next/link';
import { popularRoutes } from '@/lib/constants/routes';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">
            Book Your Bus Journey Across India
          </h1>
          <p className="text-xl text-center mb-8">
            Safe, comfortable, and affordable bus tickets
          </p>
          <div className="max-w-3xl mx-auto">
            <Link 
              href="/search"
              className="block w-full text-center bg-white text-red-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Search Buses
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Routes Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Popular Routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularRoutes.slice(0, 6).map((route, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{route.from} to {route.to}</h3>
                  <p className="text-gray-600">Starting from ₹{route.price}</p>
                </div>
                <span className="text-sm text-gray-500">{route.duration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{route.distance} km</span>
                <Link 
                  href={`/search?from=${route.from}&to=${route.to}`}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  View Buses →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">24/7 Customer Support</h3>
              <p className="text-gray-600">Round-the-clock assistance for all your travel needs</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Safe and secure payment options for worry-free booking</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive prices with regular discounts and offers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 