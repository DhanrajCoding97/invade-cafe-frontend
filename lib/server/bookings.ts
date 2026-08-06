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
      )
    `,
    )
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  console.log({
    user_id: data?.user_id,
    profiles: data?.profiles,
    customer_name: data?.customer_name,
  });

  return data as BookingRow | null;
}
