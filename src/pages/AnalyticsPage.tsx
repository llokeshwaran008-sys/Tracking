import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types';
import { CategoryBarChart, TrendLineChart } from '../components/dashboard/Charts';
import { Skeleton } from '../components/ui/Skeleton';

export default function AnalyticsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await bookingService.getBookings();
      setBookings(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-float-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gradient-clay">Analytics</h2>
        <p className="text-muted-foreground mt-1">Detailed breakdown of your booking data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="clay-card bg-card p-6 animate-float-in" style={{ animationDelay: '100ms' }}>
          <h3 className="text-lg font-semibold mb-4">Bookings by Category</h3>
          <CategoryBarChart bookings={bookings} />
        </div>
        
        <div className="clay-card bg-card p-6 animate-float-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-semibold mb-4">Bookings Trend</h3>
          <TrendLineChart bookings={bookings} />
        </div>
      </div>
    </div>
  );
}
