'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed. Your booking ID is: <span className="font-semibold">{bookingId}</span>
        </p>
        
        <div className="space-y-4">
          <Link
            href={`/bookings?success=true`}
            className="block w-full bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors"
          >
            View All Bookings
          </Link>
          
          <Link
            href="/"
            className="block w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
} 