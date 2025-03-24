'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BusSearchResults from '@/app/components/BusSearchResults';

interface Bus {
  id: string;
  operatorId: string;
  operatorName: string;
  busType: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  rating: number;
  amenities: string[];
}

interface Filters {
  busType: string[];
  departureTime: string[];
  operators: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';

  const [buses, setBuses] = useState<Bus[]>([]);
  const [filters, setFilters] = useState<Filters>({
    busType: [],
    departureTime: [],
    operators: [],
    priceRange: { min: 0, max: 5000 }
  });

  // Generate mock buses when the component mounts or search params change
  useEffect(() => {
    const operators = [
      { id: 'op1', name: 'Express Travels', rating: 4.5 },
      { id: 'op2', name: 'Royal Buses', rating: 4.3 },
      { id: 'op3', name: 'Comfort Lines', rating: 4.7 },
      { id: 'op4', name: 'Prime Bus Services', rating: 4.2 }
    ];

    const busTypes = ['AC Sleeper', 'Non AC Sleeper', 'AC Seater', 'Non AC Seater'];
    const amenities = ['WiFi', 'USB Charging', 'Blanket', 'Water Bottle', 'Emergency Contact', 'Movie'];
    
    // Generate departure times throughout the day
    const times = [
      { dep: '06:00', arr: '14:00' },
      { dep: '08:30', arr: '16:30' },
      { dep: '10:45', arr: '18:45' },
      { dep: '13:15', arr: '21:15' },
      { dep: '15:30', arr: '23:30' },
      { dep: '18:00', arr: '02:00' },
      { dep: '20:30', arr: '04:30' },
      { dep: '22:45', arr: '06:45' }
    ];

    const generatedBuses: Bus[] = [];
    
    // Generate multiple buses for each operator
    operators.forEach(operator => {
      busTypes.forEach(busType => {
        times.forEach((time, index) => {
          // Randomize which combinations to include
          if (Math.random() > 0.5) {
            const basePrice = busType.includes('AC') ? 1200 : 800;
            const sleeperExtra = busType.includes('Sleeper') ? 300 : 0;
            const price = basePrice + sleeperExtra + Math.floor(Math.random() * 200);

            generatedBuses.push({
              id: `${operator.id}-${busType}-${index}`,
              operatorId: operator.id,
              operatorName: operator.name,
              busType,
              departureTime: time.dep,
              arrivalTime: time.arr,
              duration: '8h 0m',
              price,
              seatsAvailable: Math.floor(Math.random() * 30) + 10,
              rating: operator.rating,
              amenities: amenities.filter(() => Math.random() > 0.5)
            });
          }
        });
      });
    });

    setBuses(generatedBuses);
  }, [from, to, date]);

  const filteredBuses = buses.filter(bus => {
    const matchBusType = filters.busType.length === 0 || filters.busType.includes(bus.busType);
    const matchOperator = filters.operators.length === 0 || filters.operators.includes(bus.operatorId);
    const matchPrice = bus.price >= filters.priceRange.min && bus.price <= filters.priceRange.max;
    const matchDepartureTime = filters.departureTime.length === 0 || filters.departureTime.some(timeRange => {
      const hour = parseInt(bus.departureTime.split(':')[0]);
      switch (timeRange) {
        case 'Morning': return hour >= 6 && hour < 12;
        case 'Afternoon': return hour >= 12 && hour < 17;
        case 'Evening': return hour >= 17 && hour < 21;
        case 'Night': return hour >= 21 || hour < 6;
        default: return true;
      }
    });

    return matchBusType && matchOperator && matchPrice && matchDepartureTime;
  });

  const toggleFilter = (type: keyof Omit<Filters, 'priceRange'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? (prev[type] as string[]).filter(item => item !== value)
        : [...(prev[type] as string[]), value]
    }));
  };

  const handleNewSearch = () => {
    router.push('/search');
  };

  const handleBusSelect = (busId: string) => {
    router.push(`/bus/${busId}/booking?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BusSearchResults 
        from={from} 
        to={to} 
        date={date}
        onSelect={handleBusSelect}
      />
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
} 