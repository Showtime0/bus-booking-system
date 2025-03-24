'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PaymentFormProps {
  amount: number;
  onSubmit: (paymentDetails: PaymentDetails) => void;
  onBack: () => void;
}

interface PaymentDetails {
  method: 'upi' | 'card' | 'netbanking' | 'wallet';
  details: {
    [key: string]: string;
  };
}

const PAYMENT_METHODS = [
  {
    id: 'upi',
    name: 'UPI',
    icon: '📱',
    description: 'Pay using UPI apps like Google Pay, PhonePe, or Paytm',
    fields: [
      { name: 'upiId', label: 'UPI ID', type: 'text', placeholder: 'username@upi' }
    ]
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Pay using Visa, MasterCard, or RuPay cards',
    fields: [
      { name: 'cardNumber', label: 'Card Number', type: 'text', placeholder: '1234 5678 9012 3456' },
      { name: 'expiryDate', label: 'Expiry Date', type: 'text', placeholder: 'MM/YY' },
      { name: 'cvv', label: 'CVV', type: 'password', placeholder: '123' },
      { name: 'name', label: 'Name on Card', type: 'text', placeholder: 'John Doe' }
    ]
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: '🏦',
    description: 'Pay directly from your bank account',
    fields: [
      {
        name: 'bank',
        label: 'Select Bank',
        type: 'select',
        options: [
          'SBI',
          'HDFC',
          'ICICI',
          'Axis',
          'Kotak',
          'Yes Bank',
          'Other'
        ]
      }
    ]
  },
  {
    id: 'wallet',
    name: 'Mobile Wallet',
    icon: '👛',
    description: 'Pay using mobile wallets',
    fields: [
      {
        name: 'wallet',
        label: 'Select Wallet',
        type: 'select',
        options: [
          'Paytm',
          'PhonePe',
          'Amazon Pay',
          'Mobikwik',
          'Other'
        ]
      }
    ]
  }
];

export default function PaymentForm({ amount, onSubmit, onBack }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);

    if (!method) return false;

    method.fields.forEach(field => {
      if (!formData[field.name] || !formData[field.name].trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    // Add specific validations
    if (selectedMethod === 'card') {
      if (formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      if (formData.expiryDate && !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
      }
      if (formData.cvv && !/^\d{3}$/.test(formData.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        method: selectedMethod as PaymentDetails['method'],
        details: formData
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Payment Details
        </h2>

        {/* Amount Display */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Amount to Pay</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{amount}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {PAYMENT_METHODS.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200
                ${selectedMethod === method.id
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
                }
              `}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{method.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {method.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {method.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.fields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           focus:ring-2 focus:ring-red-500 focus:border-transparent
                           dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 
                            focus:border-transparent dark:bg-gray-700 dark:text-white
                            ${errors[field.name] 
                              ? 'border-red-500' 
                              : 'border-gray-300 dark:border-gray-600'
                            }`}
                />
              )}
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {/* Form Actions */}
          <div className="flex justify-between space-x-4 pt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium
                       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                       transition-colors duration-200"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium
                       hover:bg-red-700 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                       dark:focus:ring-offset-gray-800"
            >
              Pay ₹{amount}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 