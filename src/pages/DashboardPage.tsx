import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { StatusPieChart, MonthlyBarChart } from '../components/dashboard/Charts';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types';
import { Target, CheckCircle2, Clock, IndianRupee } from 'lucide-react';

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('All');

  useEffect(() => {
    const loadData = async () => {
      const data = await bookingService.getBookings();
      setBookings(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
  }

  const totalBookings = bookings.length;
  const completedCount = bookings.filter(b => b.status === 'Done').length;
  const upcomingCount = bookings.filter(b => b.status === 'Upcoming').length;
  
  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.bookingAmount || 0), 0);
  const totalPendingBalance = bookings.reduce((sum, b) => sum + Number(b.balanceAmount || 0), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get unique years for the dropdown
  const uniqueYears = Array.from(new Set(bookings.map(b => String(b.year)).filter(Boolean))).sort();
  
  // Filter bookings for the monthly chart
  const monthlyChartBookings = selectedYear === 'All' 
    ? bookings 
    : bookings.filter(b => String(b.year) === selectedYear);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening with your bookings.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Bookings" 
          value={totalBookings} 
          icon={Target} 
        />
        <StatCard 
          title="Upcoming Events" 
          value={upcomingCount} 
          icon={Clock} 
        />
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(totalRevenue)} 
          icon={IndianRupee} 
        />
        <StatCard 
          title="Pending Balance" 
          value={formatCurrency(totalPendingBalance)} 
          icon={CheckCircle2} 
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Bookings by Status</h3>
          <StatusPieChart bookings={bookings} />
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Bookings per Month</h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1 bg-secondary border-none rounded-md text-sm focus:ring-2 focus:ring-primary/50"
            >
              <option value="All">All Years</option>
              {uniqueYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <MonthlyBarChart bookings={monthlyChartBookings} />
        </div>
      </div>
    </div>
  );
}
