import { createClient } from '../supabase/server';
import { createClient as createBrowserClient } from '../supabase/client';
import { type CustomerRow } from '@/types';

export const customerKeys = {
  all: ['customers'] as const,
};

function mapRows(data: any[]): CustomerRow[] {
  return (data ?? []).map((row: any) => ({
    ...row,
    booking_count: row.bookings?.[0]?.count ?? 0,
  }));
}

// Server-only — uses next/headers via the server Supabase client.
// Call this ONLY from Server Components (e.g. page.tsx's initial fetch).
export async function getCustomers(): Promise<CustomerRow[]> {
  const supabase = await createClient();

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

  return mapRows(data);
}

// Client-safe — uses the browser Supabase client, no next/headers.
// Call this ONLY from client-side code (e.g. useQuery's queryFn).
export async function getCustomersClient(): Promise<CustomerRow[]> {
  const supabase = createBrowserClient();

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

  return mapRows(data);
}
