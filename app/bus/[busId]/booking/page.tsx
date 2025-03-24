'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import SeatSelection from '@/app/components/SeatSelection';
import BookingProgress from '@/app/components/BookingProgress';
import PassengerForm from '@/app/components/PassengerForm';
import PaymentForm from '@/app/components/PaymentForm';

interface PassengerDetails {
  seatNumber: string;
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  idType: 'aadhar' | 'pan' | 'passport' | 'driving';
  idNumber: string;
}

interface PaymentDetails {
  method: 'upi' | 'card' | 'netbanking' | 'wallet';
  details: {
    [key: string]: string;
  };
}

interface BookingDetails {
  busId: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  busOperator: string;
  busType: string;
  seatNumbers: string[];
  passengerDetails: PassengerDetails[];
  totalAmount: number;
  contactDetails: {
    email: string;
    phone: string;
  };
}

const BOOKING_STEPS = [
  {
    title: 'Select Seats',
    description: 'Choose your preferred seats',
    icon: '💺'
  },
  {
    title: 'Passenger Details',
    description: 'Fill in passenger information',
    icon: '👤'
  },
  {
    title: 'Payment',
    description: 'Complete your payment',
    icon: '💳'
  }
];

export default function BusBookingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const busId = params.busId as string;

  // Get search parameters
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  // Initialize with step 0 (seat selection)
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  // Log component mount and parameters
  useEffect(() => {
    console.log('BusBookingPage mounted with:', {
      busId,
      from,
      to,
      date,
      currentStep
    });
  }, [busId, from, to, date, currentStep]);

  const handleSeatConfirm = (seats: string[]) => {
    console.log('handleSeatConfirm called with seats:', seats);
    if (seats && seats.length > 0) {
      setSelectedSeats(seats);
      // Calculate total amount based on bus type and distance
      const basePrice = 800; // Base price for non-AC
      const acMultiplier = 1.5; // AC buses cost 50% more
      const distanceMultiplier = 1.2; // Price increases with distance
      const total = seats.length * basePrice * acMultiplier * distanceMultiplier;
      setTotalAmount(total);
      console.log('Moving to passenger details step');
      setCurrentStep(1);
    } else {
      console.log('No seats selected');
    }
  };

  const handlePassengerSubmit = (passengers: PassengerDetails[]) => {
    console.log('handlePassengerSubmit called with passengers:', passengers);
    setPassengerDetails(passengers);
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (paymentDetails: PaymentDetails) => {
    console.log('handlePaymentSubmit called with payment:', paymentDetails);
    
    // Create booking details
    const booking: BookingDetails = {
      busId,
      from: from || '',
      to: to || '',
      date: date || '',
      departureTime: '06:00', // This should come from bus details
      arrivalTime: '12:00', // This should come from bus details
      duration: '6h', // This should be calculated
      busOperator: 'Express Travels', // This should come from bus details
      busType: 'AC', // This should come from bus details
      seatNumbers: selectedSeats,
      passengerDetails,
      totalAmount,
      contactDetails: {
        email: 'user@example.com', // This should come from user profile
        phone: '1234567890' // This should come from user profile
      }
    };

    setBookingDetails(booking);
    
    // Here you would typically:
    // 1. Make an API call to process the payment
    // 2. Create the booking in your database
    // 3. Send confirmation emails/SMS
    // For now, we'll just redirect to the success page
    const bookingId = `BOOK${Date.now()}`;
    console.log('Redirecting to booking success with bookingId:', bookingId);
    router.push(`/booking-success?bookingId=${bookingId}`);
  };

  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // Here you would typically:
      // 1. Make an API call to cancel the booking
      // 2. Process refund if applicable
      // 3. Send cancellation confirmation
      console.log('Booking cancelled');
      router.push('/bookings');
    }
  };

  const handleBack = () => {
    console.log('handleBack called, current step:', currentStep);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render content based on current step
  const renderStepContent = () => {
    console.log('Rendering step content for step:', currentStep);
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Journey Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {from} → {to}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(date || '').toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => router.back()}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Change Journey
                </button>
              </div>
            </div>

            {/* Seat Selection */}
            <SeatSelection
              busId={busId}
              onConfirm={handleSeatConfirm}
              maxSeats={6}
            />
          </div>
        );
      case 1:
        return (
          <PassengerForm
            selectedSeats={selectedSeats}
            onSubmit={handlePassengerSubmit}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <PaymentForm
            amount={totalAmount}
            onSubmit={handlePaymentSubmit}
            onBack={handleBack}
          />
        );
      default:
        console.log('Unknown step:', currentStep);
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      {/* Booking Progress */}
      <BookingProgress
        currentStep={currentStep}
        steps={BOOKING_STEPS}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {renderStepContent()}
      </div>
    </div>
  );
} 