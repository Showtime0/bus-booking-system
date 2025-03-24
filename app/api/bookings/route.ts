import { NextResponse } from 'next/server';
import type { BookingFormData } from '@/app/types/booking';

// Mock database - in a real app, this would be your database
const mockBookings = [
  {
    id: 'BK001',
    from: 'Bangalore',
    to: 'Mysore',
    date: '2024-03-20',
    busOperator: 'VRL Travels',
    busType: 'AC Sleeper',
    departureTime: '10:00 PM',
    arrivalTime: '6:00 AM',
    seatNumbers: ['A1', 'A2'],
    totalAmount: 1200,
    status: 'confirmed',
    passengerDetails: [
      { name: 'John Doe', age: 28, gender: 'Male' },
      { name: 'Jane Doe', age: 26, gender: 'Female' }
    ],
    contactDetails: {
      email: 'john@example.com',
      phone: '+91 9876543210'
    }
  },
  // ... existing mock bookings ...
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sortBy') || 'date';
    const order = searchParams.get('order') || 'desc';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    // Filter bookings
    let filteredBookings = mockBookings.filter(booking => {
      const matchesSearch = 
        booking.from.toLowerCase().includes(search.toLowerCase()) ||
        booking.to.toLowerCase().includes(search.toLowerCase()) ||
        booking.id.toLowerCase().includes(search.toLowerCase()) ||
        booking.busOperator.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === 'all' || booking.status === status;

      const bookingDate = new Date(booking.date);
      const matchesDateRange = 
        (!startDate || bookingDate >= new Date(startDate)) &&
        (!endDate || bookingDate <= new Date(endDate));

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Sort bookings
    filteredBookings.sort((a, b) => {
      if (sortBy === 'date') {
        return order === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'amount') {
        return order === 'asc'
          ? a.totalAmount - b.totalAmount
          : b.totalAmount - a.totalAmount;
      }
      if (sortBy === 'status') {
        return order === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

    // Calculate pagination
    const totalItems = filteredBookings.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

    return NextResponse.json({
      bookings: paginatedBookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { bookingId, status, reason } = await request.json();
    
    // In a real app, update the booking in the database
    // For now, just return a success response
    return NextResponse.json({
      success: true,
      message: `Booking ${bookingId} status updated to ${status}`
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: BookingFormData = await request.json();

    // Here you would typically:
    // 1. Validate the data
    // 2. Save to database
    // 3. Process payment
    // 4. Send confirmation email
    // 5. Return booking details

    // For now, we'll simulate a successful booking
    const bookingId = `BK${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    const arrivalTime = new Date(data.date + 'T' + data.departureTime);
    arrivalTime.setHours(arrivalTime.getHours() + 4); // Assuming 4-hour journey

    const booking = {
      id: bookingId,
      ...data,
      status: 'confirmed',
      arrivalTime: arrivalTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      totalAmount: calculateAmount(data),
      seatNumbers: generateSeatNumbers(data.passengerDetails.length)
    };

    // Store in localStorage for demo purposes
    const storedBookings = localStorage.getItem('recentBookings');
    const recentBookings = storedBookings ? JSON.parse(storedBookings) : [];
    localStorage.setItem('recentBookings', JSON.stringify([...recentBookings, bookingId]));

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}

function calculateAmount(data: BookingFormData): number {
  // Simple calculation based on number of passengers and bus type
  const basePrice = data.busType.includes('AC') ? 1000 : 800;
  return basePrice * data.passengerDetails.length;
}

function generateSeatNumbers(count: number): string[] {
  // Simple seat number generation
  const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length: count }, (_, i) => {
    const row = rows[Math.floor(i / 4)];
    const number = (i % 4) + 1;
    return `${row}${number}`;
  });
} 