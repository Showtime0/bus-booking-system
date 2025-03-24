'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TicketModal from '../components/TicketModal';
import { pdf } from '@react-pdf/renderer';
import TicketTemplate from '../components/TicketTemplate';

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

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('myBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      // Add sample booking data if none exists
      const sampleBookings: BookingDetails[] = [
        {
          bookingId: 'BOOK1742805680248',
          date: '2024-03-24',
          from: 'Bangalore',
          to: 'Mysore',
          departureTime: '10:00 AM',
          arrivalTime: '1:30 PM',
          busOperator: 'VRL Travels',
          busType: 'AC Sleeper',
          seats: ['E2'],
          amount: 1440,
          passengerDetails: [
            {
              name: 'John Doe',
              age: '28',
              gender: 'Male',
              seatNumber: 'E2'
            }
          ],
          paymentMethod: 'Credit Card',
          status: 'confirmed',
          bookingDate: '2024-02-20'
        },
        {
          bookingId: 'BOOK1742804846064',
          date: '2024-03-24',
          from: 'Mumbai',
          to: 'Pune',
          departureTime: '9:00 AM',
          arrivalTime: '12:00 PM',
          busOperator: 'SRS Travels',
          busType: 'AC Seater',
          seats: ['A3', 'A4'],
          amount: 1200,
          passengerDetails: [
            {
              name: 'Jane Doe',
              age: '25',
              gender: 'Female',
              seatNumber: 'A3'
            },
            {
              name: 'Mike Smith',
              age: '30',
              gender: 'Male',
              seatNumber: 'A4'
            }
          ],
          paymentMethod: 'UPI',
          status: 'confirmed',
          bookingDate: '2024-02-19'
        }
      ];

      localStorage.setItem('myBookings', JSON.stringify(sampleBookings));
      setBookings(sampleBookings);
    }
  }, []);

  const handleViewTicket = (booking: BookingDetails) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleDownloadTicket = async (booking: BookingDetails) => {
    try {
      setIsDownloading(true);
      // Generate PDF blob
      const ticketData = {
        bookingId: booking.bookingId,
        from: booking.from,
        to: booking.to,
        date: booking.date,
        departureTime: booking.departureTime,
        arrivalTime: booking.arrivalTime,
        busOperator: booking.busOperator,
        busType: booking.busType,
        seats: booking.seats,
        amount: booking.amount,
        passengerDetails: booking.passengerDetails
      };
      
      const doc = <TicketTemplate {...ticketData} />;
      const blob = await pdf(doc).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${booking.bookingId}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ticket:', error);
      alert('Failed to download ticket. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">My Bookings</h1>
        
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {booking.from} → {booking.to}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {booking.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Booking ID</p>
                    <p className="font-medium text-gray-900 dark:text-white">{booking.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Seats</p>
                    <p className="font-medium text-gray-900 dark:text-white">{booking.seats.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount Paid</p>
                    <p className="font-medium text-gray-900 dark:text-white">₹{booking.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => handleViewTicket(booking)}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    View Ticket
                  </button>
                  <button
                    onClick={() => handleDownloadTicket(booking)}
                    disabled={isDownloading}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? 'Downloading...' : 'Download Ticket'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {bookings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No bookings found.</p>
              <Link
                href="/"
                className="mt-4 inline-flex items-center text-red-600 hover:text-red-700"
              >
                Book a ticket now →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Modal */}
      {selectedBooking && (
        <TicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bookingDetails={selectedBooking}
        />
      )}
    </div>
  );
} 