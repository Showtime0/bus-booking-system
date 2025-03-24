'use client';

import { useState } from 'react';

interface PassengerFormProps {
  selectedSeats: string[];
  onSubmit: (passengers: PassengerDetails[]) => void;
  onBack: () => void;
}

interface PassengerDetails {
  seatNumber: string;
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  idType: 'aadhar' | 'pan' | 'passport' | 'driving';
  idNumber: string;
}

const ID_TYPES = [
  { value: 'aadhar', label: 'Aadhar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'driving', label: 'Driving License' }
];

export default function PassengerForm({ selectedSeats, onSubmit, onBack }: PassengerFormProps) {
  const [passengers, setPassengers] = useState<PassengerDetails[]>(
    selectedSeats.map(seat => ({
      seatNumber: seat,
      name: '',
      age: '',
      gender: 'male',
      idType: 'aadhar',
      idNumber: ''
    }))
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    passengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) {
        newErrors[`name-${index}`] = 'Name is required';
      }
      if (!passenger.age.trim()) {
        newErrors[`age-${index}`] = 'Age is required';
      } else if (isNaN(Number(passenger.age)) || Number(passenger.age) < 1 || Number(passenger.age) > 120) {
        newErrors[`age-${index}`] = 'Please enter a valid age';
      }
      if (!passenger.idNumber.trim()) {
        newErrors[`idNumber-${index}`] = 'ID number is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(passengers);
    }
  };

  const handlePassengerChange = (index: number, field: keyof PassengerDetails, value: string) => {
    setPassengers(prev => prev.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    ));
    // Clear error when user starts typing
    if (errors[`${field}-${index}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${field}-${index}`];
        return newErrors;
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {passengers.map((passenger, index) => (
          <div 
            key={passenger.seatNumber}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Passenger {index + 1}
              </h3>
              <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm">
                Seat {passenger.seatNumber}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={passenger.name}
                  onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    ${errors[`name-${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="Enter full name"
                />
                {errors[`name-${index}`] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`name-${index}`]}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age
                </label>
                <input
                  type="text"
                  value={passenger.age}
                  onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    ${errors[`age-${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="Enter age"
                />
                {errors[`age-${index}`] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`age-${index}`]}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <div className="flex space-x-4">
                  {['male', 'female', 'other'].map((gender) => (
                    <label key={gender} className="flex items-center">
                      <input
                        type="radio"
                        value={gender}
                        checked={passenger.gender === gender}
                        onChange={(e) => handlePassengerChange(index, 'gender', e.target.value as 'male' | 'female' | 'other')}
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 dark:border-gray-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {gender}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ID Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ID Type
                </label>
                <select
                  value={passenger.idType}
                  onChange={(e) => handlePassengerChange(index, 'idType', e.target.value as 'aadhar' | 'pan' | 'passport' | 'driving')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {ID_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* ID Number */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ID Number
                </label>
                <input
                  type="text"
                  value={passenger.idNumber}
                  onChange={(e) => handlePassengerChange(index, 'idNumber', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    ${errors[`idNumber-${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder={`Enter ${ID_TYPES.find(t => t.value === passenger.idType)?.label} number`}
                />
                {errors[`idNumber-${index}`] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`idNumber-${index}`]}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Form Actions */}
        <div className="flex justify-between space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium
                     text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                     transition-colors duration-200"
          >
            Back to Seat Selection
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium
                     hover:bg-red-700 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                     dark:focus:ring-offset-gray-800"
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
} 