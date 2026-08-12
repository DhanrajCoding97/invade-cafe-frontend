import { createClient } from '@/lib/supabase/client';
import { type BookingRow } from '@/types';

const supabase = createClient();

export const bookingKeys = {
  all: ['admin-bookings'] as const,
  detail: (id: string) => ['admin-bookings', id] as const,
};

const BOOKING_SELECT = `
  *,
  profiles:user_id (full_name, avatar_url, email, phone),
  session_extensions (id, amount, payment_status)
`;

export async function fetchBookings(): Promise<BookingRow[]> {
  const { createClient } = await import('@/lib/supabase/client');
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_SELECT)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as BookingRow[];
}

export async function fetchBookingById(id: string): Promise<BookingRow> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, profiles:user_id (full_name, avatar_url, email, phone)`)
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data as BookingRow;
}

// export async function fetchBookings(): Promise<BookingRow[]> {
//   const { data, error } = await supabase
//     .from('bookings')
//     .select(
//       `
//       *,
//       profiles:user_id (
//         full_name,
//         avatar_url,
//         email,
//         phone
//       )
//     `,
//     )
//     .order('created_at', { ascending: false });

//   if (error) {
//     throw new Error(error.message);
//   }

//   return (data ?? []) as BookingRow[];
// }
