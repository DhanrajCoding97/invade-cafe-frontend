// lib/actions/bookings.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth/requrireRole';

export async function cancelBooking(bookingId: string) {
  await requireRole(['owner', 'staff']);
  const supabase = await createClient();
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);
  if (error) throw new Error(error.message);
}

export async function updatePaymentStatus(
  bookingId: string,
  status: string,
  method: string,
) {
  await requireRole(['owner', 'staff']);
  const supabase = await createClient();
  const { error } = await supabase
    .from('bookings')
    .update({ payment_status: status, payment_method: method })
    .eq('id', bookingId);
  if (error) throw new Error(error.message);
}
