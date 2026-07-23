import { createClient } from '@/lib/supabase/client';
import { type BookingRow } from '@/types';

const supabase = createClient();

export const bookingKeys = {
  all: ['admin-bookings'] as const,
};

export async function fetchBookings(): Promise<BookingRow[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as BookingRow[];
}
