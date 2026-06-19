import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import type { Booking, Status } from '../types';
import { format } from 'date-fns';

export default function KanbanPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const data = await bookingService.getBookings();
    setBookings(data);
    setLoading(false);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('bookingId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: Status) => {
    const id = e.dataTransfer.getData('bookingId');
    if (id) {
      // Optimistic update
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      // API call
      await bookingService.updateBooking(id, { status });
    }
  };

  const columns: { title: string; status: Status; bg: string; accent: string; emoji: string }[] = [
    { title: 'Upcoming', status: 'Upcoming', bg: 'bg-yellow-50 dark:bg-yellow-950/30', accent: 'from-yellow-400 to-amber-500', emoji: '📅' },
    { title: 'Processing', status: 'Processing', bg: 'bg-blue-50 dark:bg-blue-950/30', accent: 'from-blue-400 to-indigo-500', emoji: '⚙️' },
    { title: 'Done', status: 'Done', bg: 'bg-green-50 dark:bg-green-950/30', accent: 'from-green-400 to-emerald-500', emoji: '✅' },
    { title: 'Cancelled', status: 'Cancelled', bg: 'bg-red-50 dark:bg-red-950/30', accent: 'from-red-400 to-rose-500', emoji: '❌' },
  ];

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse-soft">
          <span className="text-2xl">🎯</span>
        </div>
        Loading Kanban board...
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="animate-float-in">
        <h2 className="text-3xl font-bold tracking-tight" style={{background: 'linear-gradient(135deg, hsl(252 80% 55%), hsl(220 80% 55%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
          Kanban Board
        </h2>
        <p className="text-muted-foreground mt-1">Drag and drop bookings to update their status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 flex-1">
        {columns.map((column, colIdx) => {
          const columnBookings = bookings.filter(b => b.status === column.status);
          
          return (
            <div 
              key={column.status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
              className={`clay-column p-4 flex flex-col h-full min-h-[500px] ${column.bg} animate-float-in`}
              style={{ animationDelay: `${colIdx * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span>{column.emoji}</span>
                  {column.title}
                </h3>
                <span 
                  className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, hsl(252 80% 60%), hsl(220 80% 62%))` }}
                >
                  {columnBookings.length}
                </span>
              </div>
              
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                {columnBookings.map((booking, i) => (
                  <div
                    key={booking.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, booking.id)}
                    className="clay-item bg-card p-4 animate-float-in"
                    style={{ animationDelay: `${(colIdx * 80) + (i * 50)}ms` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm line-clamp-1">{booking.clientName}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
                        {booking.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{booking.functionName}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-primary">₹{booking.bookingAmount.toLocaleString('en-IN')}</span>
                      <span className="text-muted-foreground">
                        {booking.functionDate ? format(new Date(booking.functionDate), 'MMM d, yyyy') : '-'}
                      </span>
                    </div>
                  </div>
                ))}
                {columnBookings.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border/60 rounded-2xl p-4 gap-2">
                    <span className="text-2xl opacity-40">{column.emoji}</span>
                    <span className="opacity-60">Drop here</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
