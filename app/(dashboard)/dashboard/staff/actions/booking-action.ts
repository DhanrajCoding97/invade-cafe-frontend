'use server';

import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { getDisplayRate, calculateTotal } from '@/lib/pricing';
import { requireRole } from '@/lib/auth/requrireRole';
import { type ManualBookingValues } from '@/lib/schemas/ManualBookingFormSchema';
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

export async function createManualBooking(values: ManualBookingValues) {
  await requireRole(['owner', 'staff']);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch the station server-side — never trust a client-sent rate/total
  const { data: station, error: stationError } = await supabase
    .from('stations')
    .select('hourly_rate')
    .eq('id', values.stationId)
    .single();

  if (stationError || !station) {
    throw new Error('Selected station not found.');
  }

  const rate = getDisplayRate({
    device: values.device,
    players: values.players,
    tier: values.tier,
    fallbackRate: station.hourly_rate,
  });
  const computedTotal = calculateTotal(rate, values.duration);

  const total =
    values.paymentMethod === 'complimentary'
      ? 0
      : (values.amountOverride ?? computedTotal);

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      station_id: values.stationId,
      device: values.device,
      tier: values.tier ?? null,
      players: values.players,
      duration_hours: values.duration,
      date: format(values.date, 'yyyy-MM-dd'),
      start_time: values.startTime,
      amount: total,
      status: 'confirmed',
      user_id: null,
      staff_id: user?.id ?? null,
      customer_name: values.customerName,
      customer_phone: values.customerPhone,
      payment_method: values.paymentMethod,
      session_started_at: values.startNow ? new Date().toISOString() : null,
    })
    .select('id')
    .single();

  if (error) {
    if (
      error.code === '23505' ||
      error.message?.toLowerCase().includes('conflict')
    ) {
      throw new Error('That station was just booked — pick another one.');
    }
    throw new Error(error.message);
  }

  return data.id;
}

export async function updateManualBooking(
  bookingId: string,
  values: ManualBookingValues,
) {
  await requireRole(['owner', 'staff']);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch the station server-side — never trust a client-sent rate/total
  const { data: station, error: stationError } = await supabase
    .from('stations')
    .select('hourly_rate')
    .eq('id', values.stationId)
    .single();

  if (stationError || !station) {
    throw new Error('Selected station not found.');
  }

  const rate = getDisplayRate({
    device: values.device,
    players: values.players,
    tier: values.tier,
    fallbackRate: station.hourly_rate,
  });
  const computedTotal = calculateTotal(rate, values.duration);

  const total =
    values.paymentMethod === 'complimentary'
      ? 0
      : (values.amountOverride ?? computedTotal);

  const { error } = await supabase
    .from('bookings')
    .update({
      station_id: values.stationId,
      device: values.device,
      tier: values.tier ?? null,
      players: values.players,
      duration_hours: values.duration,
      date: format(values.date, 'yyyy-MM-dd'),
      start_time: values.startTime,
      amount: total,
      customer_name: values.customerName,
      customer_phone: values.customerPhone,
      payment_method: values.paymentMethod,
    })
    .eq('id', bookingId);

  if (error) {
    if (
      error.code === '23505' ||
      error.message?.toLowerCase().includes('conflict')
    ) {
      throw new Error('That station was just booked — pick another one.');
    }
    throw new Error(error.message);
  }
}
