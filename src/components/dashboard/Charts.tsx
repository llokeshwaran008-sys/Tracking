import React from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import type { Booking } from '../../types';

// Using exact HSL values from index.css for the custom clay tooltip and chart colors
const COLORS = [
  'hsl(252 80% 60%)', // Primary Purple
  'hsl(330 80% 60%)', // Pink
  'hsl(180 70% 45%)', // Teal
  'hsl(45 90% 50%)',  // Yellow
  'hsl(145 60% 50%)', // Green
  'hsl(200 80% 55%)'  // Blue
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="clay-card bg-card/90 backdrop-blur-md p-4 border border-border shadow-xl rounded-xl text-sm">
        <p className="font-bold text-gradient-clay mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 font-semibold text-foreground/80">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ... Status Pie Chart ...
export function StatusPieChart({ bookings }: { bookings: Booking[] }) {
  const data = [
    { name: 'Done', value: bookings.filter(b => b.status === 'Done').length },
    { name: 'Processing', value: bookings.filter(b => b.status === 'Processing').length },
    { name: 'Upcoming', value: bookings.filter(b => b.status === 'Upcoming').length },
    { name: 'Cancelled', value: bookings.filter(b => b.status === 'Cancelled').length },
  ].filter(d => d.value > 0);

  const statusColors: Record<string, string> = {
    'Done': 'hsl(145 60% 50%)',       // Green
    'Processing': 'hsl(200 80% 55%)', // Blue
    'Upcoming': 'hsl(45 90% 50%)',    // Yellow
    'Cancelled': 'hsl(0 80% 60%)'     // Red
  };

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
            paddingAngle={8}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ... Monthly Bar Chart ...
export function MonthlyBarChart({ bookings }: { bookings: Booking[] }) {
  const data = bookings.reduce((acc: any[], booking) => {
    if (!booking.functionDate) return acc;
    
    const date = new Date(booking.functionDate);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const key = `${month} ${year}`;
    
    const existing = acc.find(item => item.name === key);
    if (existing) {
      existing.bookings += 1;
      existing.revenue += booking.bookingAmount;
    } else {
      acc.push({
        name: key,
        bookings: 1,
        revenue: booking.bookingAmount,
        dateObj: date // for sorting
      });
    }
    return acc;
  }, []);

  // Sort by date
  data.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
          <YAxis yAxisId="left" orientation="left" stroke="hsl(252 80% 60%)" axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" stroke="hsl(145 60% 50%)" axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
          <Bar yAxisId="left" dataKey="bookings" name="Bookings" fill="hsl(252 80% 60%)" radius={[4, 4, 0, 0]} barSize={32} />
          <Bar yAxisId="right" dataKey="revenue" name="Revenue (₹)" fill="hsl(145 60% 50%)" radius={[4, 4, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ... Category Bar Chart ...
export function CategoryBarChart({ bookings }: { bookings: Booking[] }) {
  const data = bookings.reduce((acc: any[], booking) => {
    const category = booking.category || 'Other';
    
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({
        name: category,
        value: 1
      });
    }
    return acc;
  }, []);

  // Sort by value descending
  data.sort((a, b) => b.value - a.value);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)' }} dy={10} />
          <YAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(150, 150, 150, 0.1)' }} />
          <Bar dataKey="value" name="Total Bookings" radius={[4, 4, 0, 0]} maxBarSize={50}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
