'use client';

import { useState, useEffect } from 'react';

interface BookingStatsProps {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export default function BookingStats({
  totalBookings,
  activeBookings,
  completedBookings,
  cancelledBookings
}: BookingStatsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div 
        className={`transform transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        } bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
      >
        <p className="text-sm font-medium text-gray-500 mb-2">Total Bookings</p>
        <p className="text-3xl font-bold text-gray-900">{totalBookings}</p>
        <div className="mt-2 h-1 w-16 bg-gray-200 rounded-full"></div>
      </div>
      
      <div 
        className={`transform transition-all duration-500 delay-100 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        } bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500`}
      >
        <p className="text-sm font-medium text-gray-500 mb-2">Active Bookings</p>
        <p className="text-3xl font-bold text-green-600">{activeBookings}</p>
        <div className="mt-2 h-1 w-16 bg-green-200 rounded-full"></div>
      </div>
      
      <div 
        className={`transform transition-all duration-500 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        } bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500`}
      >
        <p className="text-sm font-medium text-gray-500 mb-2">Completed</p>
        <p className="text-3xl font-bold text-blue-600">{completedBookings}</p>
        <div className="mt-2 h-1 w-16 bg-blue-200 rounded-full"></div>
      </div>
      
      <div 
        className={`transform transition-all duration-500 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        } bg-gradient-to-br from-white to-red-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-red-500`}
      >
        <p className="text-sm font-medium text-gray-500 mb-2">Cancelled</p>
        <p className="text-3xl font-bold text-red-600">{cancelledBookings}</p>
        <div className="mt-2 h-1 w-16 bg-red-200 rounded-full"></div>
      </div>
    </div>
  );
} 