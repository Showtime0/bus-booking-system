'use client';

import { Document, Page, Text, View, StyleSheet, PDFViewer, Image, Font } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

interface TicketPDFProps {
  booking: {
    bookingId: string;
    date: string;
    from: string;
    to: string;
    seats: string[];
    amount: number;
    passengerDetails: {
      name: string;
      age: string;
      gender: string;
      seatNumber: string;
    }[];
    paymentMethod: string;
    status: string;
    bookingDate: string;
  };
}

// Register fonts (optional - you can add custom fonts here)
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: '2pt solid #f43f5e',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f43f5e',
    fontFamily: 'Roboto',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    width: 120,
    fontSize: 10,
    color: '#666',
  },
  value: {
    fontSize: 12,
    flex: 1,
  },
  qrCode: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 20,
  },
  passengerSection: {
    marginTop: 20,
    borderTop: '1pt solid #e5e7eb',
    paddingTop: 10,
  },
  passengerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  passenger: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f9fafb',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 8,
    borderTop: '1pt solid #e5e7eb',
    paddingTop: 10,
  },
});

export default function TicketPDF({ booking }: TicketPDFProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = await QRCode.toDataURL(JSON.stringify({
          bookingId: booking.bookingId,
          seats: booking.seats,
          date: booking.date,
        }));
        setQrCodeUrl(qrData);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQRCode();
  }, [booking]);

  if (!qrCodeUrl) {
    return null;
  }

  return (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Bus Ticket</Text>
            <Text style={styles.subtitle}>Booking Reference: {booking.bookingId}</Text>
          </View>

          {/* Journey Details */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>From:</Text>
              <Text style={styles.value}>{booking.from}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>To:</Text>
              <Text style={styles.value}>{booking.to}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Journey Date:</Text>
              <Text style={styles.value}>
                {new Date(booking.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Seats:</Text>
              <Text style={styles.value}>{booking.seats.join(', ')}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Amount Paid:</Text>
              <Text style={styles.value}>₹{booking.amount}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Payment Method:</Text>
              <Text style={styles.value}>{booking.paymentMethod}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{booking.status}</Text>
            </View>
          </View>

          {/* Passenger Details */}
          <View style={styles.passengerSection}>
            <Text style={styles.passengerTitle}>Passenger Details</Text>
            {booking.passengerDetails.map((passenger, index) => (
              <View key={index} style={styles.passenger}>
                <View style={styles.row}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{passenger.name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Age:</Text>
                  <Text style={styles.value}>{passenger.age} years</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Gender:</Text>
                  <Text style={styles.value}>{passenger.gender}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Seat Number:</Text>
                  <Text style={styles.value}>{passenger.seatNumber}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* QR Code */}
          <Image src={qrCodeUrl} style={styles.qrCode} />

          {/* Footer */}
          <View style={styles.footer}>
            <Text>This is an electronically generated ticket and does not require a physical signature.</Text>
            <Text>For customer support, please contact our 24/7 helpline at 1800-XXX-XXXX</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
} 