export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Upcoming' | 'Processing' | 'Done' | 'Cancelled';

export interface Booking {
  id: string;
  clientName: string;
  functionName: string;
  contact: string;
  year: number | string;
  functionDate: string;
  bookingAmount: number;
  advancePaid: number;
  balanceAmount: number;
  isBalancePaid: boolean;
  status: Status;
  category: string;
  createdAt: string;
}
