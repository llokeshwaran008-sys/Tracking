import type { Booking, Status } from '../types';
import { supabase } from '../lib/supabase';

// Helper to map DB snake_case to camelCase
const mapToBooking = (row: any): Booking => ({
  id: row.id,
  clientName: row.client_name,
  functionName: row.function_name,
  contact: row.contact,
  year: row.year,
  functionDate: row.function_date,
  bookingAmount: Number(row.booking_amount),
  advancePaid: Number(row.advance_paid),
  balanceAmount: Number(row.balance_amount),
  isBalancePaid: row.is_balance_paid,
  status: row.status as Status,
  category: row.category,
  createdAt: row.created_at,
});

// Helper to map camelCase to DB snake_case
const mapToRow = (booking: Partial<Booking>): any => {
  const row: any = {};
  if (booking.clientName !== undefined) row.client_name = booking.clientName;
  if (booking.functionName !== undefined) row.function_name = booking.functionName;
  if (booking.contact !== undefined) row.contact = booking.contact;
  if (booking.year !== undefined) row.year = Number(booking.year);
  if (booking.functionDate !== undefined) row.function_date = booking.functionDate;
  if (booking.bookingAmount !== undefined) row.booking_amount = booking.bookingAmount;
  if (booking.advancePaid !== undefined) row.advance_paid = booking.advancePaid;
  if (booking.balanceAmount !== undefined) row.balance_amount = booking.balanceAmount;
  if (booking.isBalancePaid !== undefined) row.is_balance_paid = booking.isBalancePaid;
  if (booking.status !== undefined) row.status = booking.status;
  if (booking.category !== undefined) row.category = booking.category;
  return row;
};

class BookingService {
  async getBookings(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return (data || []).map(mapToBooking);
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching booking:', error);
      return undefined;
    }

    return mapToBooking(data);
  }

  async addBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert(mapToRow(booking))
      .select()
      .single();

    if (error) {
      console.error('Error adding booking:', error);
      throw error;
    }

    return mapToBooking(data);
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const { data, error } = await supabase
      .from('bookings')
      .update(mapToRow(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking:', error);
      return undefined;
    }

    return mapToBooking(data);
  }

  async deleteBooking(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      return false;
    }

    return true;
  }
}

export const bookingService = new BookingService();
