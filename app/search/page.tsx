'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { popularCities } from '@/lib/constants/routes';

export default function SearchPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: ''
  });
  const [suggestions, setSuggestions] = useState({
    from: [] as string[],
    to: [] as string[]
  });
  const [focused, setFocused] = useState({
    from: false,
    to: false
  });

  const handleInputChange = (field: 'from' | 'to', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (value.length > 0) {
      const filtered = popularCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(prev => ({ ...prev, [field]: filtered }));
    } else {
      setSuggestions(prev => ({ ...prev, [field]: [] }));
    }
  };

  const handleSuggestionClick = (field: 'from' | 'to', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSuggestions(prev => ({ ...prev, [field]: [] }));
    setFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      date: formData.date
    });
    router.push(`/search/results?${searchParams.toString()}`);
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Bus Tickets</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <input
                  type="text"
                  id="from"
                  value={formData.from}
                  onChange={(e) => handleInputChange('from', e.target.value)}
                  onFocus={() => setFocused(prev => ({ ...prev, from: true }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter city"
                  required
                />
                {focused.from && suggestions.from.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {suggestions.from.map((city) => (
                      <div
                        key={city}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick('from', city)}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="text"
                  id="to"
                  value={formData.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  onFocus={() => setFocused(prev => ({ ...prev, to: true }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter city"
                  required
                />
                {focused.to && suggestions.to.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {suggestions.to.map((city) => (
                      <div
                        key={city}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick('to', city)}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  min={today}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Search Buses
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 