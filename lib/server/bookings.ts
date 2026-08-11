import { createClient } from '@/lib/supabase/server';
import type { BookingRow } from '@/types';

// export async function getBookingById(id: string): Promise<BookingRow | null> {
//   const supabase = await createClient();

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
//     .eq('id', id)
//     .maybeSingle();

//   if (error) throw error;
//   console.log({
//     user_id: data?.user_id,
//     profiles: data?.profiles,
//     customer_name: data?.customer_name,
//   });

//   return data as BookingRow | null;
// }
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

export async function fetchBookings(): Promise<BookingRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, profiles:user_id (full_name, avatar_url, email, phone)`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as BookingRow[];
}
