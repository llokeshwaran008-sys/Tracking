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

  const columns: { title: string; status: Status; color: string }[] = [
    { title: 'Upcoming', status: 'Upcoming', color: 'bg-yellow-500/10 border-yellow-500/20' },
    { title: 'Processing', status: 'Processing', color: 'bg-blue-500/10 border-blue-500/20' },
    { title: 'Done', status: 'Done', color: 'bg-green-500/10 border-green-500/20' },
    { title: 'Cancelled', status: 'Cancelled', color: 'bg-red-500/10 border-red-500/20' },
  ];

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading Kanban board...</div>;
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Kanban Board</h2>
        <p className="text-muted-foreground mt-1">Drag and drop bookings to update their status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
        {columns.map(column => {
          const columnBookings = bookings.filter(b => b.status === column.status);
          
          return (
            <div 
              key={column.status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
              className={`rounded-xl border p-4 flex flex-col h-full min-h-[500px] ${column.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{column.title}</h3>
                <span className="bg-background px-2 py-1 rounded-full text-xs font-semibold">
                  {columnBookings.length}
                </span>
              </div>
              
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                {columnBookings.map(booking => (
                  <div
                    key={booking.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, booking.id)}
                    className="bg-card p-4 rounded-lg border border-border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm line-clamp-1">{booking.clientName}</h4>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                        {booking.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{booking.functionName}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-primary">₹{booking.bookingAmount.toLocaleString('en-IN')}</span>
                      <span className="text-muted-foreground">
                        {booking.functionDate ? format(new Date(booking.functionDate), 'MMM d, yyyy') : '-'}
                      </span>
                    </div>
                  </div>
                ))}
                {columnBookings.length === 0 && (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border/50 rounded-lg p-4">
                    Drop here
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
