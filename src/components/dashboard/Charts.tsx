import React from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import type { Booking } from '../../types';
import { format } from 'date-fns';

interface ChartsProps {
  bookings: Booking[];
}

const STATUS_COLORS = {
  Upcoming: '#f59e0b',  // Yellow
  Processing: '#3b82f6', // Blue
  Done: '#10b981',       // Green
  Cancelled: '#ef4444'   // Red
};

const CATEGORY_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6', '#0ea5e9'];

export function StatusPieChart({ bookings }: ChartsProps) {
  const data = [
    { name: 'Upcoming', value: bookings.filter(b => b.status === 'Upcoming').length },
    { name: 'Processing', value: bookings.filter(b => b.status === 'Processing').length },
    { name: 'Done', value: bookings.filter(b => b.status === 'Done').length },
    { name: 'Cancelled', value: bookings.filter(b => b.status === 'Cancelled').length },
  ].filter(d => d.value > 0);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', borderRadius: '8px' }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyBarChart({ bookings }: ChartsProps) {
  const monthlyData = bookings.reduce((acc, booking) => {
    if (!booking.functionDate) return acc;
    const date = new Date(booking.functionDate);
    if (isNaN(date.getTime())) return acc;
    const month = format(date, 'MMM yy');
    
    if (!acc[month]) {
      acc[month] = { name: month, count: 0 };
    }
    acc[month].count += 1;
    return acc;
  }, {} as Record<string, { name: string, count: number }>);

  const data = Object.values(monthlyData);

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} dx={-10} />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--secondary))' }}
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', borderRadius: '8px' }}
          />
          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBarChart({ bookings }: ChartsProps) {
  const catData = bookings.reduce((acc, booking) => {
    const cat = booking.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = { name: cat, count: 0 };
    acc[cat].count += 1;
    return acc;
  }, {} as Record<string, { name: string, count: number }>);

  const data = Object.values(catData).sort((a, b) => b.count - a.count).slice(0, 6);

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} dx={-10} />
          <Tooltip cursor={{ fill: 'hsl(var(--secondary))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
