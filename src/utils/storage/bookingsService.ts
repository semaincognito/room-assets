import { load, save } from './storage';
import type { Booking } from '@/types/models';

const KEY = 'bookings';

export function getBookings(): Booking[] {
  return load<Booking[]>(KEY, []);
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export function createBooking(newBooking: Booking) {
  const bookings = getBookings();

  const conflict = bookings.some(b => {
    if (b.roomId !== newBooking.roomId) return false;

    return overlaps(
      new Date(newBooking.start),
      new Date(newBooking.end),
      new Date(b.start),
      new Date(b.end)
    );
  });

  if (conflict) {
    throw new Error('Booking conflict detected');
  }

  save(KEY, [...bookings, newBooking]);
}

export function deleteBooking(id: string) {
  const bookings = getBookings();
  save(KEY, bookings.filter(b => b.id !== id));
}