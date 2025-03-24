'use client';

import { Suspense } from 'react';

export default function BookingSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
} 