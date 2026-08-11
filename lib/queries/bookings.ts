// import { createClient } from '@/lib/supabase/client';
// import { type BookingRow } from '@/types';

// const supabase = createClient();

// export const bookingKeys = {
//   all: ['admin-bookings'] as const,
//   detail: (id: string) => ['admin-bookings', id] as const,
// };
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
// export async function fetchBookingById(id: string): Promise<BookingRow> {
//   const { data, error } = await supabase
//     .from('bookings')
//     .select(`*, profiles:user_id (full_name, avatar_url, email, phone)`)
//     .eq('id', id)
//     .single();

//   if (error) throw new Error(error.message);
//   return data as BookingRow;
// }
// lib/queries/bookings.ts
import { createClient } from '@/lib/supabase/server'; // server client — reads cookies via next/headers
import { type BookingRow } from '@/types';

export const bookingKeys = {
  all: ['admin-bookings'] as const,
};

export async function fetchBookings(): Promise<BookingRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, profiles:user_id (full_name, avatar_url, email, phone)`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as BookingRow[];
}
