export interface PassengerDetails {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface ContactDetails {
  email: string;
  phone: string;
}

export type BusType = 'AC' | 'Non-AC' | 'Sleeper';

export interface BookingFormData {
  from: string;
  to: string;
  date: string;
  busType: BusType;
  departureTime: string;
  passengerDetails: PassengerDetails[];
  contactDetails: ContactDetails;
}

export interface Booking {
  id: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  boardingPoint: string;
  droppingPoint: string;
  busOperator: string;
  busOperatorPhone: string;
  busType: string;
  seatNumbers: string[];
  baseFare: number;
  tax: number;
  serviceFee: number;
  totalAmount: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  passengerDetails: {
    name: string;
    age: number;
    gender: string;
  }[];
  contactDetails: {
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
} 