import type { Booking } from '../types';

export const mockBookings: Booking[] = [
  {
    id: '1',
    clientName: 'KARTHI',
    functionName: 'BABY SHOWER',
    contact: '9751828658',
    year: 2025,
    functionDate: '2025-08-03',
    bookingAmount: 32000,
    advancePaid: 5000,
    balanceAmount: 27000,
    isBalancePaid: false,
    status: 'Done',
    category: 'Baby Shower',
    createdAt: '2025-01-09T10:00:00Z',
  },
  {
    id: '2',
    clientName: 'RAGU',
    functionName: 'ENGAGEMENT',
    contact: '',
    year: 2025,
    functionDate: '2025-09-04',
    bookingAmount: 32000,
    advancePaid: 5000,
    balanceAmount: 27000,
    isBalancePaid: false,
    status: 'Upcoming',
    category: 'Engagement',
    createdAt: '2025-01-28T09:00:00Z',
  }
];
