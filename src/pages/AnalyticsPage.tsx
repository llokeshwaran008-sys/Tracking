import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types';
import { CategoryBarChart, StatusPieChart } from '../components/dashboard/Charts';

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
    return <div className="p-8 text-center text-muted-foreground">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground mt-1">Detailed breakdown of your booking data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Bookings by Category</h3>
          <CategoryBarChart bookings={bookings} />
        </div>
        
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
          <StatusPieChart bookings={bookings} />
        </div>
      </div>
    </div>
  );
}
