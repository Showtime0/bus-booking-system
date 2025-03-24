'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface BookingDetails {
  bookingId: string;
  date: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  busOperator: string;
  busType: string;
  seats: string[];
  amount: number;
  passengerDetails: {
    name: string;
    age: string;
    gender: string;
    seatNumber: string;
  }[];
  paymentMethod: string;
  status: 'confirmed';
  bookingDate: string;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    if (bookingId) {
      // Get existing bookings or initialize empty array
      const existingBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
      let currentBooking = existingBookings.find((b: BookingDetails) => b.bookingId === bookingId);
      
      // If booking doesn't exist, create it from URL parameters
      if (!currentBooking) {
        const passengers = searchParams.get('passengers');
        const parsedPassengers = passengers ? JSON.parse(decodeURIComponent(passengers)) : [];
        
        currentBooking = {
          bookingId,
          date: searchParams.get('date') || new Date().toISOString(),
          from: searchParams.get('from') || '',
          to: searchParams.get('to') || '',
          departureTime: searchParams.get('departureTime') || '',
          arrivalTime: searchParams.get('arrivalTime') || '',
          busOperator: searchParams.get('busOperator') || '',
          busType: searchParams.get('busType') || '',
          seats: (searchParams.get('seats') || '').split(',').filter(Boolean),
          amount: Number(searchParams.get('amount')) || 0,
          passengerDetails: parsedPassengers,
          paymentMethod: searchParams.get('paymentMethod') || 'card',
          status: 'confirmed',
          bookingDate: new Date().toISOString()
        };

        // Add new booking to existing bookings
        existingBookings.unshift(currentBooking);
        
        // Save to localStorage
        localStorage.setItem('myBookings', JSON.stringify(existingBookings));
      }
      
      setBookingDetails(currentBooking);

      // Simulate loading booking details
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [bookingId, searchParams]);

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">
              Invalid booking reference.
            </p>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            ← Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your booking has been confirmed and your tickets are ready.
              </p>
            </div>

            {/* Booking Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Booking Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Booking Reference</p>
                    <p className="font-medium text-gray-900 dark:text-white">{bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Journey Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {bookingDetails?.date ? new Date(bookingDetails.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                    <p className="font-medium text-gray-900 dark:text-white">{bookingDetails?.from || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                    <p className="font-medium text-gray-900 dark:text-white">{bookingDetails?.to || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bus Type</p>
                    <p className="font-medium text-gray-900 dark:text-white">{bookingDetails?.busType || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bus Operator</p>
                    <p className="font-medium text-gray-900 dark:text-white">{bookingDetails?.busOperator || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Departure Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">{bookingDetails?.departureTime || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Arrival Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">{bookingDetails?.arrivalTime || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Seats</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {bookingDetails?.seats?.join(', ') || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount Paid</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ₹{bookingDetails?.amount?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              {bookingDetails?.passengerDetails && bookingDetails.passengerDetails.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Passenger Details
                  </h3>
                  <div className="space-y-4">
                    {bookingDetails.passengerDetails.map((passenger, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{passenger.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {passenger.age} years • {passenger.gender}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Seat {passenger.seatNumber}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Status */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                    <p className="font-medium text-green-600 dark:text-green-400">Paid</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Secured by</span>
                    <span className="font-medium text-gray-900 dark:text-white">🔒 SSL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/my-bookings"
                className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg
                         text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                         focus:ring-red-500 transition-colors duration-200"
              >
                View Booking
              </Link>
              <Link
                href="/"
                className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-gray-300
                         dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white
                         dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none
                         focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                Back to Home
              </Link>
            </div>

            {/* Ticket Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Ticket Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                    <p>
                      Your e-ticket has been sent to your registered email address. You can also
                      download it from your bookings page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 