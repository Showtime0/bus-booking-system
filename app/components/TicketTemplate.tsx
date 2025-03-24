'use client';

import { Booking } from '../types/booking';
import { QRCodeSVG } from 'qrcode.react';
import { FaBus, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import { calculateDuration } from '../utils/dateUtils';

interface TicketTemplateProps {
  booking: Booking;
}

export default function TicketTemplate({ booking }: TicketTemplateProps) {
  const duration = calculateDuration(booking.departureTime, booking.arrivalTime);
  const currentDate = new Date().toLocaleDateString('en-IN');
  const invoiceNo = `INV-${booking.id}-${Math.floor(Math.random() * 10000)}`;

  return (
    <div className="w-full bg-white">
      <style jsx global>{`
        @media print {
          @page {
            size: 210mm 297mm;
            margin: 0;
            padding: 0;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: white;
            font-size: 8px;
            line-height: 1.1;
            margin: 0;
            padding: 0;
            width: 210mm;
            height: 297mm;
          }

          .a4-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 10mm;
            box-sizing: border-box;
            background: white;
            page-break-after: always;
          }

          .ticket-container {
            width: 190mm;
            margin: 0 auto;
            border: 1px solid #000;
            padding: 5mm;
            position: relative;
            page-break-inside: avoid;
            background: white;
          }

          .ticket-header {
            background: linear-gradient(45deg, #000080, #1a237e) !important;
            color: white !important;
            padding: 3mm !important;
          }

          .ticket-section {
            border-bottom: 0.5px solid #ccc;
            padding: 3mm 0;
            margin: 0 3mm;
          }

          .passenger-table {
            width: 100%;
            border-collapse: collapse;
            margin: 2mm 0;
          }

          .passenger-table th,
          .passenger-table td {
            border: 0.5px solid #ccc;
            padding: 1.5mm;
            text-align: left;
          }

          .passenger-table th {
            background-color: #f5f5f5 !important;
            font-size: 8px;
          }

          .passenger-table td {
            font-size: 9px;
          }

          .amount-table {
            width: 100%;
            border-collapse: collapse;
          }

          .amount-table td {
            padding: 1mm 2mm;
            font-size: 9px;
          }

          .amount-total {
            border-top: 0.5px dashed #000;
            font-weight: bold;
          }

          .qr-section {
            position: absolute;
            top: 20mm;
            right: 5mm;
          }

          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 48px;
            color: rgba(0, 0, 0, 0.03) !important;
            white-space: nowrap;
            pointer-events: none;
            z-index: 0;
          }

          .content-section {
            position: relative;
            z-index: 1;
          }
        }
      `}</style>

      <div className="a4-container">
        <div className="ticket-container">
          {/* Watermark */}
          <div className="watermark">BUS TICKET</div>

          <div className="content-section">
            {/* Header */}
            <div className="ticket-header flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaBus className="text-xl" />
                <div>
                  <div className="text-base font-bold">BusBook</div>
                  <div className="text-[8px]">Your Trusted Travel Partner</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[8px]">Invoice No: {invoiceNo}</div>
                <div className="text-[8px]">Date: {currentDate}</div>
              </div>
      </div>

            {/* Journey Details */}
            <div className="ticket-section">
              <div className="grid grid-cols-2 gap-4">
          <div>
                  <div className="flex items-center gap-1 text-[8px] text-gray-600">
                    <FaUser className="text-[9px]" />
                    <span>Primary Passenger</span>
          </div>
                  <div className="text-[9px] font-medium">{booking.passengerDetails[0].name}</div>
                  
                  <div className="mt-1 flex items-center gap-1 text-[8px] text-gray-600">
                    <FaPhone className="text-[9px]" />
                    <span>{booking.contactDetails?.phone}</span>
          </div>
                  <div className="flex items-center gap-1 text-[8px] text-gray-600">
                    <FaEnvelope className="text-[9px]" />
                    <span>{booking.contactDetails?.email}</span>
          </div>
        </div>

          <div>
                  <div className="flex items-center gap-1 text-[8px] text-gray-600">
                    <FaBus className="text-[9px]" />
                    <span>Bus Operator</span>
                  </div>
                  <div className="text-[9px] font-medium">{booking.busOperator}</div>

                  <div className="mt-1 flex items-center gap-1 text-[8px] text-gray-600">
                    <FaCalendarAlt className="text-[9px]" />
                    <span>Journey Date: {new Date(booking.date).toLocaleDateString('en-IN')}</span>
          </div>
                  <div className="flex items-center gap-1 text-[8px] text-gray-600">
                    <FaClock className="text-[9px]" />
                    <span>Duration: {duration}</span>
          </div>
          </div>
        </div>

              <div className="mt-2 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-[9px] text-blue-600" />
                    <span className="text-[9px] font-medium">{booking.from}</span>
                  </div>
                  <div className="text-[8px] text-gray-600 ml-4">{booking.departureTime}</div>
                </div>
                <div className="border-t border-dashed border-gray-400 flex-1 mx-2 relative">
                  <FaBus className="text-[10px] text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <FaMapMarkerAlt className="text-[9px] text-red-600" />
                    <span className="text-[9px] font-medium">{booking.to}</span>
                  </div>
                  <div className="text-[8px] text-gray-600 mr-4">{booking.arrivalTime}</div>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="ticket-section">
              <div className="text-[9px] font-medium mb-1">Passenger Details</div>
              <table className="passenger-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Seat No.</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.passengerDetails.map((passenger, index) => (
                    <tr key={index}>
                      <td>{passenger.name}</td>
                      <td>{passenger.gender}</td>
                      <td>{passenger.age}</td>
                      <td>{booking.seatNumbers[index]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Details */}
            <div className="ticket-section grid grid-cols-2 gap-4">
            <div>
                <div className="text-[9px] font-medium mb-1">Payment Details</div>
                <table className="amount-table">
                  <tbody>
                    <tr>
                      <td className="text-[8px] text-gray-600">Base Fare</td>
                      <td className="text-[8px] text-right">₹{booking.baseFare}</td>
                    </tr>
                    <tr>
                      <td className="text-[8px] text-gray-600">Service Fee</td>
                      <td className="text-[8px] text-right">₹{booking.serviceFee}</td>
                    </tr>
                    <tr>
                      <td className="text-[8px] text-gray-600">IGST (2.5%)</td>
                      <td className="text-[8px] text-right">₹{(booking.tax / 2).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="text-[8px] text-gray-600">SGST (2.5%)</td>
                      <td className="text-[8px] text-right">₹{(booking.tax / 2).toFixed(2)}</td>
                    </tr>
                    <tr className="amount-total">
                      <td className="text-[9px]">Total Amount</td>
                      <td className="text-[9px] text-right">₹{booking.totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
            </div>

            <div>
                <div className="text-[9px] font-medium mb-1">Important Information</div>
                <ul className="text-[8px] text-gray-600 list-disc pl-3 space-y-0.5">
                  <li>Please arrive 30 minutes before departure</li>
                  <li>Carry valid ID proof during journey</li>
                  <li>No refund on confirmed tickets</li>
                  <li>Baggage limit: 15kg per passenger</li>
                </ul>
            </div>
            </div>

            {/* Footer */}
            <div className="p-2 flex justify-between items-center border-t border-gray-200">
              <div className="text-[8px] text-gray-500">
                This is a computer-generated ticket and does not require signature
          </div>
              <div className="flex items-center gap-2">
                <QRCodeSVG 
                  value={`BUSBOOK-${booking.id}`}
                  size={24}
                  level="H"
                  includeMargin={true}
                />
                <div className="text-[8px] text-gray-500">Scan to verify</div>
        </div>
            </div>

            {/* QR Code Section */}
            <div className="qr-section">
              <QRCodeSVG 
                value={`BUSBOOK-${booking.id}`}
                size={40}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 