'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Seat {
  id: string;
  number: string;
  isBooked: boolean;
  price: number;
  type: 'seater' | 'sleeper';
  deck: 'lower' | 'upper';
}

export default function SeatSelectionPage({ params }: { params: { busId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const busType = searchParams.get('type') || '';
  const basePrice = Number(searchParams.get('price')) || 0;

  // Generate seats based on bus type
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const isSleeper = busType.includes('Sleeper');
    const totalSeats = isSleeper ? 30 : 40;
    const decks = isSleeper ? ['lower', 'upper'] : ['lower'];
    
    decks.forEach(deck => {
      const seatsPerDeck = totalSeats / decks.length;
      for (let i = 1; i <= seatsPerDeck; i++) {
        const seatNumber = `${deck === 'upper' ? 'U' : 'L'}${i.toString().padStart(2, '0')}`;
        seats.push({
          id: `${deck}-${i}`,
          number: seatNumber,
          isBooked: Math.random() < 0.3, // 30% chance of being booked
          price: basePrice + (deck === 'upper' ? 50 : 0), // Upper deck costs more
          type: isSleeper ? 'sleeper' : 'seater',
          deck: deck as 'lower' | 'upper'
        });
      }
    });
    return seats;
  };

  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) return;

    setSelectedSeats(prev => {
      if (prev.includes(seat.id)) {
        return prev.filter(id => id !== seat.id);
      }
      if (prev.length >= 6) {
        alert('You can only select up to 6 seats');
        return prev;
      }
      return [...prev, seat.id];
    });
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    const selectedSeatNumbers = selectedSeats
      .map(id => seats.find(seat => seat.id === id)?.number)
      .join(',');

    router.push(`/bus/${params.busId}/booking?seats=${selectedSeatNumbers}&total=${getTotalPrice()}&from=${from}&to=${to}&date=${date}`);
  };

  const renderSeatMap = (deck: 'lower' | 'upper') => {
    const deckSeats = seats.filter(seat => seat.deck === deck);
    const rows = Math.ceil(deckSeats.length / 4); // 4 seats per row

    return (
      <div className="grid gap-4">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-8">
            {/* Left side (2 seats) */}
            <div className="flex gap-2">
              {deckSeats.slice(rowIndex * 4, rowIndex * 4 + 2).map(seat => (
                <button
                  key={seat.id}
                  disabled={seat.isBooked}
                  onClick={() => handleSeatClick(seat)}
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium
                    ${seat.isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                    selectedSeats.includes(seat.id) ? 'bg-green-500 text-white' :
                    'bg-white border-2 border-gray-300 text-gray-700 hover:border-red-500'}
                  `}
                >
                  {seat.number}
                </button>
              ))}
            </div>
            
            {/* Aisle */}
            <div className="w-8" />
            
            {/* Right side (2 seats) */}
            <div className="flex gap-2">
              {deckSeats.slice(rowIndex * 4 + 2, rowIndex * 4 + 4).map(seat => (
                <button
                  key={seat.id}
                  disabled={seat.isBooked}
                  onClick={() => handleSeatClick(seat)}
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium
                    ${seat.isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                    selectedSeats.includes(seat.id) ? 'bg-green-500 text-white' :
                    'bg-white border-2 border-gray-300 text-gray-700 hover:border-red-500'}
                  `}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Select Seats</h1>
          
          {/* Journey Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{from}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{to}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(date).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bus Type</p>
                <p className="font-medium">{busType}</p>
              </div>
            </div>
          </div>

          {/* Seat Legend */}
          <div className="flex gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded" />
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <span className="text-sm text-gray-600">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded" />
              <span className="text-sm text-gray-600">Selected</span>
            </div>
          </div>

          {/* Seat Map */}
          <div className="space-y-8">
            {busType.includes('Sleeper') && (
              <>
                <div>
                  <h2 className="text-lg font-semibold mb-4">Upper Deck</h2>
                  {renderSeatMap('upper')}
                </div>
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-lg font-semibold mb-4">Lower Deck</h2>
                  {renderSeatMap('lower')}
                </div>
              </>
            )}
            {!busType.includes('Sleeper') && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Seating</h2>
                {renderSeatMap('lower')}
              </div>
            )}
          </div>

          {/* Selected Seats Summary */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Selected Seats:</p>
                <p className="font-medium">
                  {selectedSeats.length > 0
                    ? selectedSeats
                        .map(id => seats.find(seat => seat.id === id)?.number)
                        .join(', ')
                    : 'None'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Total Amount:</p>
                <p className="text-2xl font-bold text-gray-900">₹{getTotalPrice()}</p>
              </div>
            </div>

            <button
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
              className="mt-6 w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Proceed to Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 