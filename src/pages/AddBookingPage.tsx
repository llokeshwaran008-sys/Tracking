import React from 'react';
import { AddBookingForm } from '../components/bookings/AddBookingForm';

export default function AddBookingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add Booking</h2>
        <p className="text-muted-foreground mt-1">Create a new booking and track its details.</p>
      </div>
      
      <AddBookingForm />
    </div>
  );
}
