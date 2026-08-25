import { createClient } from '@/lib/supabase/server';
import type { BookingRow } from '@/types';

export async function getBookingById(id: string): Promise<BookingRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        avatar_url,
        email,
        phone
      ),
            stations:station_id (
        name,
        type
      ),
      session_extensions (
        id,
        minutes,
        amount,
        payment_status,
        marked_paid_by,
        created_at
      )
    `,
    )
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data as BookingRow | null;
}

const BOOKING_SELECT = `
  *,
  profiles:user_id (full_name, avatar_url, email, phone),
  session_extensions (id, minutes, amount, payment_status)
`;
export async function fetchBookingsServer(): Promise<BookingRow[]> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_SELECT)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as BookingRow[];
}
