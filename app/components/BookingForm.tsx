'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BookingFormData, PassengerDetails, BusType } from '../types/booking';

interface BookingFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (data: BookingFormData) => Promise<void>;
}

const initialFormState: BookingFormData = {
  from: '',
  to: '',
  date: '',
  busType: 'AC',
  departureTime: '',
  passengerDetails: [{ name: '', age: 0, gender: 'male' }],
  contactDetails: {
    email: '',
    phone: ''
  }
};

export default function BookingForm({ isOpen, setIsOpen, onSubmit }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>(initialFormState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      setIsOpen(false);
      setFormData(initialFormState);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPassenger = () => {
    setFormData(prev => ({
      ...prev,
      passengerDetails: [...prev.passengerDetails, { name: '', age: 0, gender: 'male' }]
    }));
  };

  const removePassenger = (index: number) => {
    setFormData(prev => ({
      ...prev,
      passengerDetails: prev.passengerDetails.filter((_, i) => i !== index)
    }));
  };

  const updatePassenger = (index: number, field: keyof PassengerDetails, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      passengerDetails: prev.passengerDetails.map((passenger, i) => 
        i === index ? { 
          ...passenger, 
          [field]: field === 'age' ? Number(value) || 0 : value 
        } : passenger
      )
    }));
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={() => setIsOpen(false)}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="modal-backdrop" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="modal-content">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                  Book Your Journey
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors focus-ring rounded-lg"
                >
                  <span className="sr-only">Close</span>
                  <div className="relative w-6 h-6">
                    <div className="absolute top-1/2 left-0 w-6 h-0.5 bg-current transform rotate-45"></div>
                    <div className="absolute top-1/2 left-0 w-6 h-0.5 bg-current transform -rotate-45"></div>
                  </div>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="form-group">
                    <label htmlFor="from" className="form-label">From</label>
                    <input
                      type="text"
                      id="from"
                      value={formData.from}
                      onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
                      className="form-input"
                      placeholder="Enter departure city"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="to" className="form-label">To</label>
                    <input
                      type="text"
                      id="to"
                      value={formData.to}
                      onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                      className="form-input"
                      placeholder="Enter destination city"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date" className="form-label">Date</label>
                    <input
                      type="date"
                      id="date"
                      value={formData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="busType" className="form-label">Bus Type</label>
                    <select
                      id="busType"
                      value={formData.busType}
                      onChange={(e) => setFormData(prev => ({ ...prev, busType: e.target.value as BusType }))}
                      className="form-input"
                    >
                      <option value="AC">AC</option>
                      <option value="Non-AC">Non-AC</option>
                      <option value="Sleeper">Sleeper</option>
                    </select>
                  </div>

                  <div className="form-group sm:col-span-2">
                    <label htmlFor="departureTime" className="form-label">Departure Time</label>
                    <input
                      type="time"
                      id="departureTime"
                      value={formData.departureTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, departureTime: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">Passenger Details</h4>
                    <button
                      type="button"
                      onClick={addPassenger}
                      className="btn btn-secondary text-sm"
                    >
                      Add Passenger
                    </button>
                  </div>

                  {formData.passengerDetails.map((passenger, index) => (
                    <div key={index} className="card p-4 space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-700">Passenger {index + 1}</h5>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removePassenger(index)}
                            className="text-sm text-red-600 hover:text-red-700 focus-ring rounded-lg px-2 py-1"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="form-group">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            value={passenger.name}
                            onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                            className="form-input"
                            placeholder="Full name"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Age</label>
                          <input
                            type="number"
                            value={passenger.age || ''}
                            onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                            className="form-input"
                            min="0"
                            max="120"
                            placeholder="Age"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Gender</label>
                          <select
                            value={passenger.gender}
                            onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                            className="form-input"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Contact Details</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.contactDetails.email}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          contactDetails: { ...prev.contactDetails, email: e.target.value }
                        }))}
                        className="form-input"
                        placeholder="email@example.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.contactDetails.phone}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          contactDetails: { ...prev.contactDetails, phone: e.target.value }
                        }))}
                        className="form-input"
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full relative"
                  >
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-600 rounded-lg">
                        <div className="loading-spinner"></div>
                      </div>
                    )}
                    <span className={isLoading ? 'opacity-0' : ''}>
                      {isLoading ? 'Processing...' : 'Book Now'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
} 