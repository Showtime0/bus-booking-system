'use client';

import { useState } from 'react';
import { BusType } from '../types/booking';

interface Bus {
  id: string;
  operator: string;
  type: BusType;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  amenities: string[];
  rating: number;
}

interface BusSearchResultsProps {
  from: string;
  to: string;
  date: string;
  onSelect: (busId: string) => void;
}

const mockBuses: Bus[] = [
  {
    id: '1',
    operator: 'Express Travels',
    type: 'AC',
    departureTime: '06:00',
    arrivalTime: '12:00',
    duration: '6h',
    price: 1200,
    availableSeats: 24,
    amenities: ['WiFi', 'USB Charging', 'Water Bottle', 'Blanket'],
    rating: 4.5
  },
  {
    id: '2',
    operator: 'Royal Coaches',
    type: 'Sleeper',
    departureTime: '20:00',
    arrivalTime: '06:00',
    duration: '10h',
    price: 1800,
    availableSeats: 18,
    amenities: ['WiFi', 'Blanket', 'Snacks', 'USB Charging', 'Pillow'],
    rating: 4.8
  },
  {
    id: '3',
    operator: 'City Connect',
    type: 'Non-AC',
    departureTime: '08:00',
    arrivalTime: '13:00',
    duration: '5h',
    price: 800,
    availableSeats: 32,
    amenities: ['Water Bottle', 'Snacks'],
    rating: 4.0
  },
  {
    id: '4',
    operator: 'Luxury Express',
    type: 'AC',
    departureTime: '10:00',
    arrivalTime: '16:00',
    duration: '6h',
    price: 1500,
    availableSeats: 20,
    amenities: ['WiFi', 'USB Charging', 'Water Bottle', 'Blanket', 'Entertainment System'],
    rating: 4.7
  },
  {
    id: '5',
    operator: 'State Transport',
    type: 'Non-AC',
    departureTime: '14:00',
    arrivalTime: '19:00',
    duration: '5h',
    price: 600,
    availableSeats: 40,
    amenities: ['Water Bottle'],
    rating: 3.8
  },
  {
    id: '6',
    operator: 'Premium Travels',
    type: 'AC',
    departureTime: '22:00',
    arrivalTime: '08:00',
    duration: '10h',
    price: 2000,
    availableSeats: 16,
    amenities: ['WiFi', 'USB Charging', 'Water Bottle', 'Blanket', 'Pillow', 'Entertainment System', 'Meals'],
    rating: 4.9
  }
];

export default function BusSearchResults({ from, to, date, onSelect }: BusSearchResultsProps) {
  const [sortBy, setSortBy] = useState<'price' | 'departure' | 'duration'>('departure');
  const [filterType, setFilterType] = useState<BusType | 'all'>('all');

  const filteredBuses = mockBuses
    .filter(bus => filterType === 'all' || bus.type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        case 'duration':
          return a.duration.localeCompare(b.duration);
        default:
          return 0;
      }
    });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {from} → {to}
            </h2>
            <p className="text-sm text-gray-500">
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="form-input text-sm min-w-[120px]"
            >
              <option value="departure">Departure Time</option>
              <option value="price">Price</option>
              <option value="duration">Duration</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as BusType | 'all')}
              className="form-input text-sm min-w-[120px]"
            >
              <option value="all">All Types</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
              <option value="Sleeper">Sleeper</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBuses.map((bus) => (
          <div
            key={bus.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{bus.operator}</h3>
                    <span className="badge badge-success">{bus.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{bus.departureTime}</span>
                      →
                      <span className="font-medium">{bus.arrivalTime}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span>{bus.duration}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(bus.price)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {bus.availableSeats} seats left
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 mb-4">
                  {bus.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={`text-sm ${
                            index < Math.floor(bus.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{bus.rating}/5</span>
                  </div>
                  <button
                    onClick={() => onSelect(bus.id)}
                    className="btn btn-primary"
                  >
                    Select Seats
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredBuses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No buses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 