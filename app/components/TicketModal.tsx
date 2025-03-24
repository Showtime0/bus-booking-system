'use client';

import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import TicketTemplate from './TicketTemplate';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    bookingId: string;
    from: string;
    to: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    busOperator: string;
    busType: string;
    seats: string[];
    amount: number;
    passengerDetails: {
      name: string;
      age: string;
      gender: string;
      seatNumber: string;
    }[];
  };
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, bookingDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Close button */}
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* PDF Viewer */}
          <div className="h-[80vh] w-full">
            <PDFViewer width="100%" height="100%" className="border-0">
              <TicketTemplate {...bookingDetails} />
            </PDFViewer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal; 