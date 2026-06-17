import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { categoryService } from '../../services/categoryService';
import type { Booking } from '../../types';

type FormData = Omit<Booking, 'id' | 'createdAt'>;

export function AddBookingForm() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      status: 'Upcoming',
      isBalancePaid: false,
      year: new Date().getFullYear(),
      category: 'Wedding',
    }
  });

  const bookingAmount = watch('bookingAmount') || 0;
  const advancePaid = watch('advancePaid') || 0;

  useEffect(() => {
    const balance = Number(bookingAmount) - Number(advancePaid);
    setValue('balanceAmount', balance >= 0 ? balance : 0);
    setValue('isBalancePaid', balance <= 0);
  }, [bookingAmount, advancePaid, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await bookingService.addBooking(data);
      navigate('/features'); // Will rename to /bookings later
    } catch (error) {
      console.error('Failed to add booking:', error);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Booking</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Client Name</label>
            <input
              {...register('clientName', { required: 'Client Name is required' })}
              className="w-full px-3 py-2 bg-secondary border-none rounded-md focus:ring-2 focus:ring-primary"
              placeholder="e.g. KARTHI"
            />
            {errors.clientName && <p className="text-sm text-destructive">{errors.clientName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name of Function</label>
            <input
              {...register('functionName', { required: 'Function Name is required' })}
              className="w-full px-3 py-2 bg-secondary border-none rounded-md focus:ring-2 focus:ring-primary"
              placeholder="e.g. BABY SHOWER"
            />
            {errors.functionName && <p className="text-sm text-destructive">{errors.functionName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Number</label>
            <input
              {...register('contact', { required: 'Contact is required' })}
              className="w-full px-3 py-2 bg-secondary border-none rounded-md focus:ring-2 focus:ring-primary"
              placeholder="e.g. 9751828658"
            />
            {errors.contact && <p className="text-sm text-destructive">{errors.contact.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              {...register('functionDate', { required: 'Date is required' })}
              className="w-full px-3 py-2 bg-secondary border-none rounded-md focus:ring-2 focus:ring-primary"
            />
            {errors.functionDate && <p className="text-sm text-destructive">{errors.functionDate.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <input
              type="number"
              {...register('year', { required: 'Year is required' })}
              className="w-full px-3 py-2 bg-secondary border-none rounded-md focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 bg-secondary border-none rounded-md focus:ring-2 focus:ring-primary"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Booking Amount (₹)</label>
            <input
              type="number"
              {...register('bookingAmount', { required: 'Amount is required', min: 0 })}
              className="w-full px-3 py-2 bg-secondary border-none rounded-md focus:ring-2 focus:ring-primary"
            />
            {errors.bookingAmount && <p className="text-sm text-destructive">{errors.bookingAmount.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Advance Paid (₹)</label>
            <input
              type="number"
              {...register('advancePaid', { required: 'Advance is required', min: 0 })}
              className="w-full px-3 py-2 bg-secondary border-none rounded-md focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Balance Amount (₹)</label>
            <input
              type="number"
              {...register('balanceAmount')}
              readOnly
              className="w-full px-3 py-2 bg-muted border-none rounded-md text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 bg-secondary border-none rounded-md focus:ring-2 focus:ring-primary"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Processing">Processing</option>
              <option value="Done">Done</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => navigate('/features')}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}
