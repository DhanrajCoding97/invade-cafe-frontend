'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function startSession(bookingId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bookings')
    .update({ session_started_at: new Date().toISOString() })
    .eq('id', bookingId);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/staff');
}

export async function getRpc() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_my_role');
}

export async function endSession(bookingId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('bookings')
    .update({
      session_ended_at: new Date().toISOString(),
      status: 'completed',
    })
    .eq('id', bookingId);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/staff');
}

export async function extendSession(
  bookingId: string,
  stationId: string,
  extendMinutes: number,
) {
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select('session_started_at, duration_hours, extended_until')
    .eq('id', bookingId)
    .single();

  if (!booking || !booking.session_started_at)
    throw new Error('Session not started');

  const actualEnd = new Date(booking.session_started_at);
  actualEnd.setHours(actualEnd.getHours() + Number(booking.duration_hours));

  const base = booking.extended_until
    ? new Date(booking.extended_until)
    : actualEnd;
  const newEnd = new Date(
    base.getTime() + extendMinutes * 60_000,
  ).toISOString();

  const { data: conflicts } = await supabase
    .from('bookings')
    .select('id, date, start_time')
    .eq('station_id', stationId)
    .neq('id', bookingId)
    .eq('status', ['pending', 'confirmed']);

  const hasConflict = (conflicts ?? []).some((b) => {
    const otherStart = new Date(`${b.date}T${b.start_time}`);
    return otherStart < new Date(newEnd);
  });

  if (hasConflict) return { ok: false, reason: 'conflict' as const };

  const { error } = await supabase
    .from('bookings')
    .update({ extended_until: newEnd })
    .eq('id', bookingId);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/staff');
  return { ok: true as const };
}
