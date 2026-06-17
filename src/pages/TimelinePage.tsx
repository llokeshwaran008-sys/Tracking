import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types';
import { format, compareAsc } from 'date-fns';
import { Calendar, MapPin, Phone } from 'lucide-react';

export default function TimelinePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await bookingService.getBookings();
      // Sort chronologically, excluding cancelled
      const upcoming = data
        .filter(b => b.status !== 'Cancelled' && b.functionDate)
        .sort((a, b) => compareAsc(new Date(a.functionDate), new Date(b.functionDate)));
      setBookings(upcoming);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading timeline...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Timeline & Roadmap</h2>
        <p className="text-muted-foreground mt-1">Chronological view of all upcoming functions.</p>
      </div>

      <div className="max-w-3xl relative border-l-2 border-primary/30 ml-4 md:ml-6 mt-8 space-y-12 pb-12">
        {bookings.length === 0 ? (
          <p className="text-muted-foreground ml-6">No upcoming events scheduled.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="relative ml-8 group">
              <div className="absolute -left-[41px] top-1.5 w-5 h-5 bg-primary rounded-full border-4 border-background ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all"></div>
              
              <div className="bg-card p-5 rounded-xl border border-border shadow-sm group-hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{booking.functionName}</h3>
                    <p className="text-primary font-medium">{booking.clientName}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(booking.functionDate), 'PPP')}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50 text-sm">
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {booking.contact || 'No contact provided'}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 flex items-center justify-center font-bold">₹</span>
                      Balance: {booking.balanceAmount > 0 ? (
                        <span className="text-destructive font-medium">₹{booking.balanceAmount.toLocaleString('en-IN')} pending</span>
                      ) : (
                        <span className="text-green-500 font-medium">Fully Paid</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex sm:justify-end items-end">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      booking.status === 'Done' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                      booking.status === 'Processing' ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                      'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
