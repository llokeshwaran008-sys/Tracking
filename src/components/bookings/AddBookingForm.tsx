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
    <div className="clay-card bg-card p-6 max-w-2xl mx-auto animate-float-in">
      <h2 className="text-2xl font-bold mb-1" style={{background: 'linear-gradient(135deg, hsl(252 80% 55%), hsl(220 80% 55%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
        Add New Booking
      </h2>
      <p className="text-muted-foreground text-sm mb-6">Fill in the details to create a new booking entry.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80">Client Name</label>
            <input
              {...register('clientName', { required: 'Client Name is required' })}
              className="clay-input w-full px-3 py-2.5 bg-secondary/60 text-foreground placeholder:text-muted-foreground"
              placeholder="e.g. KARTHI"
            />
            {errors.clientName && <p className="text-xs text-destructive font-medium">{errors.clientName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80">Name of Function</label>
            <input
              {...register('functionName', { required: 'Function Name is required' })}
              className="clay-input w-full px-3 py-2.5 bg-secondary/60 text-foreground placeholder:text-muted-foreground"
              placeholder="e.g. BABY SHOWER"
            />
            {errors.functionName && <p className="text-xs text-destructive font-medium">{errors.functionName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80">Contact Number</label>
            <input
              {...register('contact', { required: 'Contact is required' })}
              className="clay-input w-full px-3 py-2.5 bg-secondary/60 text-foreground placeholder:text-muted-foreground"
              placeholder="e.g. 9751828658"
            />
            {errors.contact && <p className="text-xs text-destructive font-medium">{errors.contact.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80">Date</label>
            <input
              type="date"
              {...register('functionDate', { required: 'Date is required' })}
              className="clay-input w-full px-3 py-2.5 bg-secondary/60 text-foreground"
            />
            {errors.functionDate && <p className="text-xs text-destructive font-medium">{errors.functionDate.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80">Year</label>
            <input
              type="number"
              {...register('year', { required: 'Year is required' })}
              className="clay-input w-full px-3 py-2.5 bg-secondary/60 text-foreground"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80">Category</label>
            <select
              {...register('category')}
              className="clay-input w-full px-3 py-2.5 bg-secondary/60 text-foreground"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80">Booking Amount (₹)</label>
            <input
              type="number"
              {...register('bookingAmount', { required: 'Amount is required', min: 0 })}
              className="clay-input w-full px-3 py-2.5 bg-secondary/60 text-foreground"
            />
            {errors.bookingAmount && <p className="text-xs text-destructive font-medium">{errors.bookingAmount.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80">Advance Paid (₹)</label>
            <input
              type="number"
              {...register('advancePaid', { required: 'Advance is required', min: 0 })}
              className="clay-input w-full px-3 py-2.5 bg-secondary/60 text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80">Balance Amount (₹)</label>
            <input
              type="number"
              {...register('balanceAmount')}
              readOnly
              className="clay-input w-full px-3 py-2.5 bg-muted/70 text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80">Status</label>
            <select
              {...register('status')}
              className="clay-input w-full px-3 py-2.5 bg-secondary/60 text-foreground"
            >
              <option value="Upcoming">📅 Upcoming</option>
              <option value="Processing">⚙️ Processing</option>
              <option value="Done">✅ Done</option>
              <option value="Cancelled">❌ Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
          <button
            type="button"
            onClick={() => navigate('/features')}
            className="clay-input px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="clay-btn px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(135deg, hsl(252 80% 60%), hsl(220 80% 62%))' }}
          >
            {isSubmitting ? '✨ Saving...' : '💾 Save Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}
