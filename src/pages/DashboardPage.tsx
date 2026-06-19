import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { StatusPieChart, MonthlyBarChart } from '../components/dashboard/Charts';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types';
import { Target, CheckCircle2, Clock, IndianRupee, Wallet } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';

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

  const totalBookings = bookings.length;
  const completedCount = bookings.filter(b => b.status === 'Done').length;
  const upcomingCount = bookings.filter(b => b.status === 'Upcoming').length;
  
  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.bookingAmount || 0), 0);
  const totalAdvance = bookings.reduce((sum, b) => sum + Number(b.advancePaid || 0), 0);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const advancePercentage = totalRevenue > 0 ? (totalAdvance / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-float-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient-clay">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening with your bookings.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      {/* Revenue Progress Card */}
      <div className="clay-card bg-card p-6 animate-float-in" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, hsl(145 60% 50%), hsl(175 60% 40%))' }}>
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Revenue Collection</h3>
            <p className="text-sm text-muted-foreground">Advance collected vs Pending balance</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-green-600 dark:text-green-400">Collected: {formatCurrency(totalAdvance)}</span>
            <span className="text-destructive">Pending: {formatCurrency(totalPendingBalance)}</span>
          </div>
          <div className="h-4 w-full bg-secondary/80 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-green-500 transition-all duration-1000 ease-out" 
              style={{ width: `${advancePercentage}%` }}
              title={`Collected: ${advancePercentage.toFixed(1)}%`}
            />
            <div 
              className="h-full bg-destructive transition-all duration-1000 ease-out"
              style={{ width: `${100 - advancePercentage}%` }}
              title={`Pending: ${(100 - advancePercentage).toFixed(1)}%`}
            />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="clay-card bg-card p-6 animate-float-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-semibold mb-4">Bookings by Status</h3>
          <StatusPieChart bookings={bookings} />
        </div>
        <div className="clay-card bg-card p-6 animate-float-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Bookings per Month</h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="clay-input px-3 py-1.5 bg-secondary/60 text-sm focus:outline-none"
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
