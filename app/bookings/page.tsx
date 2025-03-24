'use client';

import { useState, useEffect, useCallback, KeyboardEvent, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TicketTemplate from '../components/TicketTemplate';
import Header from '../components/Header';
import BookingStats from '../components/BookingStats';
import { Booking as BookingType, BusType } from '../types/booking';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

interface Booking extends BookingType {
  busOperator: string;
  arrivalTime: string;
}

type SortField = 'date' | 'amount' | 'status';
type SortOrder = 'asc' | 'desc';

const statusStyles = {
  confirmed: { bg: 'bg-green-100', text: 'text-green-800' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' }
} as const;

const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    from: 'Bangalore',
    to: 'Mysore',
    date: '2024-03-20',
    busOperator: 'VRL Travels',
    busType: 'Sleeper',
    departureTime: '10:00 PM',
    arrivalTime: '6:00 AM',
    seatNumbers: ['A1', 'A2'],
    totalAmount: 1200,
    status: 'confirmed',
    passengerDetails: [
      {
        name: 'John Doe',
        age: 28,
        gender: 'male'
      }
    ],
    contactDetails: {
      email: 'john@example.com',
      phone: '+91 9876543210'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'booking-2',
    from: 'Hyderabad',
    to: 'Chennai',
    date: '2024-03-25',
    busOperator: 'Orange Travels',
    busType: 'AC Sleeper',
    departureTime: '9:30 PM',
    arrivalTime: '8:00 AM',
    seatNumbers: ['F2'],
    totalAmount: 1141,
    status: 'confirmed',
    passengerDetails: [
      {
        name: 'Sarah Wilson',
        age: 32,
        gender: 'female'
      }
    ],
    contactDetails: {
      email: 'sarah@example.com',
      phone: '+91 9876543211'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'booking-3',
    from: 'Mumbai',
    to: 'Pune',
    date: '2024-03-15',
    busOperator: 'Neeta Travels',
    busType: 'AC Seater',
    departureTime: '11:00 PM',
    arrivalTime: '3:00 AM',
    seatNumbers: ['I1', 'I2'],
    totalAmount: 2168,
    status: 'completed',
    passengerDetails: [
      {
        name: 'Mike Johnson',
        age: 45,
        gender: 'male'
      },
      {
        name: 'Lisa Johnson',
        age: 42,
        gender: 'female'
      }
    ],
    contactDetails: {
      email: 'mike@example.com',
      phone: '+91 9876543212'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'booking-4',
    from: 'Delhi',
    to: 'Agra',
    date: '2024-03-18',
    busOperator: 'Hans Travels',
    busType: 'AC Seater',
    departureTime: '8:00 PM',
    arrivalTime: '11:30 PM',
    seatNumbers: ['J4'],
    totalAmount: 1084,
    status: 'cancelled',
    passengerDetails: [
      {
        name: 'David Brown',
        age: 29,
        gender: 'male'
      }
    ],
    contactDetails: {
      email: 'david@example.com',
      phone: '+91 9876543213'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'booking-5',
    from: 'Kolkata',
    to: 'Bhubaneswar',
    date: '2024-03-22',
    busOperator: 'Bengal Travels',
    busType: 'AC Sleeper',
    departureTime: '7:30 PM',
    arrivalTime: '5:00 AM',
    seatNumbers: ['G1', 'G2', 'G3'],
    totalAmount: 3480,
    status: 'confirmed',
    passengerDetails: [
      {
        name: 'Raj Sharma',
        age: 35,
        gender: 'male'
      },
      {
        name: 'Priya Sharma',
        age: 32,
        gender: 'female'
      },
      {
        name: 'Aryan Sharma',
        age: 8,
        gender: 'male'
      }
    ],
    contactDetails: {
      email: 'raj@example.com',
      phone: '+91 9876543214'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'booking-6',
    from: 'Chennai',
    to: 'Coimbatore',
    date: '2024-03-12',
    busOperator: 'KPN Travels',
    busType: 'AC Sleeper',
    departureTime: '10:30 PM',
    arrivalTime: '4:00 AM',
    seatNumbers: ['H1', 'H2'],
    totalAmount: 2282,
    status: 'completed',
    passengerDetails: [
      {
        name: 'Anita Kumar',
        age: 27,
        gender: 'female'
      },
      {
        name: 'Rahul Kumar',
        age: 30,
        gender: 'male'
      }
    ],
    contactDetails: {
      email: 'anita@example.com',
      phone: '+91 9876543215'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const generateMockBooking = (bookingId: string): Booking => {
  return {
    ...mockBookings[0],
    id: bookingId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Modify StatusBadge to remove SVG
const StatusBadge = ({ status }: { status: Booking['status'] }) => {
  const styles = statusStyles[status as keyof typeof statusStyles];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${styles.bg} ${styles.text}`}>
      {status}
    </span>
  );
};

// Modify PassengerDetails to remove SVG
const PassengerDetails = ({ passengers }: { passengers: Booking['passengerDetails'] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-gray-600 hover:text-gray-800 flex items-center gap-2 group"
      >
        <span>{passengers.length} Passenger{passengers.length > 1 ? 's' : ''}</span>
        <span className={`text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
      </button>
      
      {isExpanded && (
        <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 p-4">
          <div className="space-y-3">
            {passengers.map((passenger, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{passenger.name}</p>
                  <p className="text-sm text-gray-500">
                    {passenger.age} years • {passenger.gender}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Modify ContactDetails to remove SVG
const ContactDetails = ({ contact }: { contact: Booking['contactDetails'] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-gray-600 hover:text-gray-800 flex items-center gap-2 group"
      >
        <span>Contact Info</span>
        <span className={`text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
      </button>
      
      {isExpanded && (
        <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 p-4">
          <div className="space-y-3">
            <div className="text-gray-600">
              Email: {contact.email}
            </div>
            <div className="text-gray-600">
              Phone: {contact.phone}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const calculateStats = (bookings: Booking[]) => {
  return {
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => b.status === 'confirmed').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    cancelledBookings: bookings.filter(b => b.status === 'cancelled').length
  };
};

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get('success') === 'true';
  
  // State for bookings and pagination
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5
  });

  // UI states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Add new state for all bookings
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  // Add new states for action loading
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Add new state for stats
  const [stats, setStats] = useState(calculateStats(mockBookings));

  // Initialize bookings with mock data and recent bookings
  useEffect(() => {
    const storedBookings = localStorage.getItem('recentBookings');
    const recentBookingIds = storedBookings ? JSON.parse(storedBookings) : [];
    
    // Generate mock bookings for recent booking IDs
    const recentBookings = recentBookingIds.map((id: string) => generateMockBooking(id));
    
    // Combine with initial mock bookings
    const allBookings = [...recentBookings, ...mockBookings];
    
    // Update state
    setAllBookings(allBookings);
    setIsLoading(false);
  }, []);

  // Fetch bookings from API (modified to handle both mock and API data)
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Filter the bookings
      const filteredBookings = allBookings.filter(booking => {
        const matchesSearch = 
          booking.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.busOperator.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'All Status' || booking.status === statusFilter.toLowerCase();

        const bookingDate = new Date(booking.date);
        const matchesDateRange = 
          (!startDate || bookingDate >= new Date(startDate)) &&
          (!endDate || bookingDate <= new Date(endDate));

        return matchesSearch && matchesStatus && matchesDateRange;
      });

      // Sort bookings
      const sortedBookings = [...filteredBookings].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      });

      // Calculate pagination
      const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
      const endIndex = startIndex + pagination.itemsPerPage;
      const paginatedBookings = sortedBookings.slice(startIndex, endIndex);

      // Update state
      setBookings(paginatedBookings);
      setPagination(prev => ({
        ...prev,
        totalItems: sortedBookings.length,
        totalPages: Math.ceil(sortedBookings.length / prev.itemsPerPage)
      }));

      // Update stats
      setStats(calculateStats(sortedBookings));
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to show notification
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Function to download ticket
  const downloadTicket = async (booking: Booking) => {
    try {
      setIsDownloading(true);
      setSelectedBooking(booking);
      
      // Wait for the template to be ready
      await new Promise(resolve => setTimeout(resolve, 100));
      window.print();
      
      showNotification('success', 'Ticket downloaded successfully');
    } catch (err) {
      showNotification('error', 'Failed to download ticket. Please try again.');
    } finally {
      setIsDownloading(false);
      setSelectedBooking(null);
    }
  };

  // Function to cancel booking
  const cancelBooking = async () => {
    if (!bookingToCancel || !cancellationReason) return;

    try {
      setIsCancelling(true);
      
      // Update the booking status in allBookings
      const updatedBookings = allBookings.map(booking => 
        booking.id === bookingToCancel 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      );
      
      setAllBookings(updatedBookings);
      await fetchBookings();

      showNotification('success', 'Booking cancelled successfully');

      // Reset modal state
      setShowCancelModal(false);
      setBookingToCancel(null);
      setCancellationReason('');
    } catch (err) {
      showNotification('error', 'Failed to cancel booking. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle modal keyboard navigation
  const handleModalKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setShowCancelModal(false);
      setBookingToCancel(null);
      setCancellationReason('');
    }
  };

  // Add effect for filter changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
      fetchBookings();
    }, 300); // Debounce search and filter changes

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, statusFilter, sortOrder, startDate, endDate]);

  // Add effect for page changes
  useEffect(() => {
    fetchBookings();
  }, [pagination.currentPage]);

  // Function to initiate booking cancellation
  const initiateCancellation = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setShowCancelModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Simple Header */}
      <div className="bg-red-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-semibold text-white">My Bookings</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <BookingStats {...stats} />
        
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 max-w-md z-50 transform transition-transform duration-300 ease-in-out ${
          notification ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className={`rounded-lg shadow-lg p-4 ${
            notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
          }`}>
            <div className="flex items-center">
                <p className={`text-sm ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {notification.message}
                </p>
                <button
                  className="ml-auto pl-3 text-gray-400 hover:text-gray-500"
                  onClick={() => setNotification(null)}
                >
                  ✕
                </button>
            </div>
          </div>
        </div>
      )}

        {/* Filter Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Filter Bookings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Find your bookings quickly</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            >
              <option>All Status</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow"
          >
            <span>Sort by Date</span>
            <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
          </button>
      </div>

      {/* Error and Success Messages */}
      {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
            <div className="flex items-center">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                className="ml-auto text-sm text-red-600 hover:text-red-800"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
          </div>
        </div>
      )}

      {showSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4">
            <div className="flex items-center">
              <p className="text-sm text-green-700">
                Your booking has been confirmed successfully!
              </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      ) : (
        <>
          {/* Bookings List */}
            <div className="space-y-4">
            {bookings.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No bookings found matching your criteria.</p>
              </div>
            ) : (
                <div className="space-y-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id} 
                      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                  >
                      <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                            {booking.from} to {booking.to}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Booking ID: {booking.id}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => downloadTicket(booking)}
                            disabled={isDownloading}
                            className="px-4 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900"
                            >
                              {isDownloading ? 'Downloading...' : 'Download Ticket'}
                          </button>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => initiateCancellation(booking.id)}
                              className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <FaCalendarAlt />
                          <span>Date: {booking.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <FaClock />
                          <span>
                            Departure: {booking.departureTime} | Arrival: {booking.arrivalTime}
                          </span>
                      </div>
                    </div>

                      <div className="mt-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : booking.status === 'completed'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
              <div className="mt-8 mb-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                    className="px-4 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                      className={`px-4 py-2 rounded-lg border ${
                      pagination.currentPage === page
                        ? 'bg-red-600 text-white border-red-600'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                  >
                    {page}
                  </button>
                ))}
                <button
                    className="px-4 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onKeyDown={handleModalKeyDown}
          tabIndex={-1}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full transform transition-all duration-300 scale-100 opacity-100"
            role="dialog"
            aria-labelledby="cancel-modal-title"
            aria-describedby="cancel-modal-description"
          >
            <h2 id="cancel-modal-title" className="text-xl font-semibold mb-4">Cancel Booking</h2>
            <p id="cancel-modal-description" className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking? Please provide a reason for cancellation.
            </p>
            <textarea
              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              rows={3}
              placeholder="Enter reason for cancellation"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                onClick={() => {
                  setShowCancelModal(false);
                  setBookingToCancel(null);
                  setCancellationReason('');
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
                onClick={cancelBooking}
                disabled={!cancellationReason || isCancelling}
              >
                {isCancelling ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Cancelling...</span>
                  </>
                ) : (
                  'Confirm Cancellation'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update the hidden ticket template */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-only, .print-only * {
            visibility: visible;
          }
          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 20%;
          }
        }
      `}</style>

      {selectedBooking && (
        <div className="print-only">
          <TicketTemplate booking={selectedBooking} />
        </div>
      )}
      </div>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    }>
      <BookingsContent />
    </Suspense>
  );
} 