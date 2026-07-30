import { createClient } from '../supabase/server';
import { type CustomerRow } from '@/types';

export async function getCustomers(): Promise<CustomerRow[]> {
  const supabase = await createClient();

  // Adjust this to match your actual profiles/bookings relationship —
  // this assumes a `profiles` table with a role column, and counts bookings per user
  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      id,
      full_name,
      email,
      phone,
      role,
      created_at,
      bookings:bookings(count)
    `,
    )
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    ...row,
    booking_count: row.bookings?.[0]?.count ?? 0,
  }));
}
