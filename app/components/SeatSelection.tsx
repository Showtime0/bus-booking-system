'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

interface SeatSelectionProps {
  busId: string;
  onConfirm: (selectedSeats: string[]) => void;
  maxSeats: number;
}

interface Seat {
  id: string;
  number: string;
  isBooked: boolean;
  price: number;
  type: 'window' | 'aisle' | 'middle';
  category: 'sleeper' | 'seater';
  deck: 'upper' | 'lower';
}

export default function SeatSelection({ busId, onConfirm, maxSeats }: SeatSelectionProps) {
  const { theme } = useTheme();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [error, setError] = useState<string>('');
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');
  const [activeCategory, setActiveCategory] = useState<'all' | 'sleeper' | 'seater'>('all');
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  // Generate mock seats data
  useEffect(() => {
    console.log('Generating seats for busId:', busId);
    const mockSeats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    rows.forEach(row => {
      const isUpperDeck = rows.indexOf(row) >= 5;
      // Left side (2 seats)
      mockSeats.push({
        id: `${row}1`,
        number: `${row}1`,
        isBooked: Math.random() > 0.8, // Reduced booking probability to have more available seats
        price: 1000 + Math.floor(Math.random() * 200),
        type: 'window',
        category: row < 'F' ? 'sleeper' : 'seater',
        deck: isUpperDeck ? 'upper' : 'lower'
      });
      mockSeats.push({
        id: `${row}2`,
        number: `${row}2`,
        isBooked: Math.random() > 0.8, // Reduced booking probability to have more available seats
        price: 1000 + Math.floor(Math.random() * 200),
        type: 'aisle',
        category: row < 'F' ? 'sleeper' : 'seater',
        deck: isUpperDeck ? 'upper' : 'lower'
      });

      // Right side (2 seats)
      mockSeats.push({
        id: `${row}3`,
        number: `${row}3`,
        isBooked: Math.random() > 0.8, // Reduced booking probability to have more available seats
        price: 1000 + Math.floor(Math.random() * 200),
        type: 'aisle',
        category: row < 'F' ? 'sleeper' : 'seater',
        deck: isUpperDeck ? 'upper' : 'lower'
      });
      mockSeats.push({
        id: `${row}4`,
        number: `${row}4`,
        isBooked: Math.random() > 0.8, // Reduced booking probability to have more available seats
        price: 1000 + Math.floor(Math.random() * 200),
        type: 'window',
        category: row < 'F' ? 'sleeper' : 'seater',
        deck: isUpperDeck ? 'upper' : 'lower'
      });
    });

    console.log('Generated seats:', mockSeats.length);
    setSeats(mockSeats);
  }, [busId]);

  const handleSeatClick = (seatId: string) => {
    console.log('Clicked seat:', seatId);
    setError('');
    
    const seat = seats.find(s => s.id === seatId);
    if (!seat) {
      console.error('Seat not found:', seatId);
      return;
    }

    if (seat.isBooked) {
      console.log('Seat is already booked:', seatId);
      return;
    }
    
    if (selectedSeats.includes(seatId)) {
      console.log('Unselecting seat:', seatId);
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length >= maxSeats) {
        const errorMsg = `You can only select up to ${maxSeats} seats`;
        console.log(errorMsg);
        setError(errorMsg);
        return;
      }
      console.log('Selecting seat:', seatId);
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      const errorMsg = 'Please select at least one seat';
      console.log(errorMsg);
      setError(errorMsg);
      return;
    }
    console.log('Confirming seats:', selectedSeats);
    onConfirm(selectedSeats);
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const filteredSeats = seats.filter(seat => {
    if (activeCategory !== 'all' && seat.category !== activeCategory) return false;
    if (seat.deck !== activeDeck) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Deck and Category Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          {/* Deck Selection */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-900">
            <button
              onClick={() => setActiveDeck('lower')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${activeDeck === 'lower' 
                  ? 'bg-red-600 text-white transform scale-102 shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              Lower Deck
            </button>
            <button
              onClick={() => setActiveDeck('upper')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${activeDeck === 'upper' 
                  ? 'bg-red-600 text-white transform scale-102 shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              Upper Deck
            </button>
          </div>

          {/* Category Selection */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-900">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${activeCategory === 'all' 
                  ? 'bg-red-600 text-white transform scale-102 shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory('sleeper')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${activeCategory === 'sleeper' 
                  ? 'bg-red-600 text-white transform scale-102 shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              Sleeper
            </button>
            <button
              onClick={() => setActiveCategory('seater')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${activeCategory === 'seater' 
                  ? 'bg-red-600 text-white transform scale-102 shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              Seater
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 dark:bg-gray-600 rounded mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Booked</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-6 h-6 mr-2">🛏️</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Sleeper</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-6 h-6 mr-2">💺</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Seater</span>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="relative">
          {/* Driver's seat */}
          {activeDeck === 'lower' && (
            <div className="absolute -top-8 left-0">
              <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center bg-white dark:bg-gray-800">
                <span className="text-xs">🚗</span>
              </div>
            </div>
          )}

          {/* Seats */}
          <div className="grid grid-cols-4 gap-2">
            {filteredSeats.map((seat) => (
              <button
                key={seat.id}
                disabled={seat.isBooked}
                onClick={() => handleSeatClick(seat.id)}
                onMouseEnter={() => setHoveredSeat(seat.id)}
                onMouseLeave={() => setHoveredSeat(null)}
                className={`
                  w-14 h-14 rounded-lg flex flex-col items-center justify-center
                  transition-all duration-200 relative
                  ${
                    seat.isBooked
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50'
                      : selectedSeats.includes(seat.id)
                      ? 'bg-red-600 text-white transform scale-105 ring-2 ring-red-300 dark:ring-red-500'
                      : hoveredSeat === seat.id
                      ? 'bg-gray-300 dark:bg-gray-600'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }
                  ${seat.type === 'aisle' ? 'mr-4' : ''}
                `}
              >
                <span className="text-xs mb-1">
                  {seat.category === 'sleeper' ? '🛏️' : '💺'}
                </span>
                <span className="text-sm font-medium">{seat.number}</span>
                {!seat.isBooked && (
                  <span className={`absolute -bottom-5 text-xs ${
                    selectedSeats.includes(seat.id)
                      ? 'text-red-600 dark:text-red-400 font-medium'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    ₹{seat.price}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Seats Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Selected Seats Summary</h3>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        <div className="space-y-4">
          {selectedSeats.length > 0 ? (
            <>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Selected Seats:</p>
                  <div className="text-gray-600 dark:text-gray-300 mt-1">
                    {selectedSeats.map(seatId => {
                      const seat = seats.find(s => s.id === seatId);
                      return seat && (
                        <span key={seatId} className="inline-flex items-center mr-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          <span className="mr-1">{seat.number}</span>
                          <span>{seat.category === 'sleeper' ? '🛏️' : '💺'}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">Total Amount:</p>
                  <p className="text-xl font-semibold text-red-600 dark:text-red-400">₹{getTotalPrice()}</p>
                </div>
              </div>
              <button
                onClick={handleConfirm}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium
                         hover:bg-red-700 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                         dark:focus:ring-offset-gray-800"
              >
                Confirm Selection
              </button>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Please select your preferred seats
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 