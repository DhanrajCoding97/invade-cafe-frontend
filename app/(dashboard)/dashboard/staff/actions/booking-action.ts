'use server';

import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { getDisplayRate, calculateTotal } from '@/lib/pricing';
import { getCafeSettings } from '@/lib/server/cafe-settitngs';
import { requireRole } from '@/lib/auth/requrireRole';
import { type ManualBookingValues } from '@/lib/schemas/ManualBookingFormSchema';
import {
  getExtensionAmount,
  resolveExtensionTier,
} from '@/lib/extension-pricing';
import { revalidatePath } from 'next/cache';
import { sendPushToStaffAndOwners } from '@/lib/push-notifications/send-push';

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

// export async function endSession(bookingId: string) {
//   const supabase = await createClient();
//   const { error } = await supabase
//     .from('bookings')
//     .update({
//       session_ended_at: new Date().toISOString(),
//       status: 'completed',
//     })
//     .eq('id', bookingId);

//   if (error) throw new Error(error.message);

//   revalidatePath('/dashboard/staff');
// }

// export async function extendSession(
//   bookingId: string,
//   stationId: string,
//   extendMinutes: number,
// ) {
//   const supabase = await createClient();

//   const { data: booking } = await supabase
//     .from('bookings')
//     .select('session_started_at, duration_hours, extended_until')
//     .eq('id', bookingId)
//     .single();

//   if (!booking || !booking.session_started_at)
//     throw new Error('Session not started');

//   const actualEnd = new Date(booking.session_started_at);
//   actualEnd.setHours(actualEnd.getHours() + Number(booking.duration_hours));

//   const base = booking.extended_until
//     ? new Date(booking.extended_until)
//     : actualEnd;
//   const newEnd = new Date(
//     base.getTime() + extendMinutes * 60_000,
//   ).toISOString();

//   const { data: conflicts } = await supabase
//     .from('bookings')
//     .select('id, date, start_time')
//     .eq('station_id', stationId)
//     .neq('id', bookingId)
//     .eq('status', ['pending', 'confirmed']);

//   const hasConflict = (conflicts ?? []).some((b) => {
//     const otherStart = new Date(`${b.date}T${b.start_time}`);
//     return otherStart < new Date(newEnd);
//   });

//   if (hasConflict) return { ok: false, reason: 'conflict' as const };

//   const { error } = await supabase
//     .from('bookings')
//     .update({ extended_until: newEnd })
//     .eq('id', bookingId);

//   if (error) throw new Error(error.message);
//   revalidatePath('/dashboard/staff');
//   return { ok: true as const };
// }

// // app/actions/sessions.ts
// 'use server';

// import { createClient } from '@/lib/supabase/server';
// import { getExtensionAmount } from '@/lib/extension-pricing';

export async function endSession(bookingId: string) {
  const supabase = await createClient();

  // 1. Get the booking and station name before updating it
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select(
      `
      id,
      station_id,
      status,
      stations (
        name
      )
    `,
    )
    .eq('id', bookingId)
    .single();

  if (bookingError) {
    throw new Error(bookingError.message);
  }

  if (!booking) {
    throw new Error('Booking not found');
  }

  // Prevent ending an already completed/cancelled booking
  if (booking.status === 'completed') {
    throw new Error('Session has already ended');
  }

  if (booking.status === 'cancelled') {
    throw new Error('Cannot end a cancelled booking');
  }

  // Supabase relation can be an object or array depending on relationship
  const station = Array.isArray(booking.stations)
    ? booking.stations[0]
    : booking.stations;

  const stationName = station?.name ?? 'Station';

  // 2. End the session
  const { error: updateError } = await supabase
    .from('bookings')
    .update({
      session_ended_at: new Date().toISOString(),
      status: 'completed',
    })
    .eq('id', bookingId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  // 3. Notify staff + owners
  // Don't fail the session-ending operation if push notification fails.
  try {
    await sendPushToStaffAndOwners({
      title: 'Session ended',
      body: `${stationName} — session has ended`,
      url: '/dashboard/staff',
    });
  } catch (error) {
    console.error('Failed to send session-ended push notification:', error);
  }

  // 4. Refresh the staff dashboard
  revalidatePath('/dashboard/staff');

  return {
    success: true,
  };
}
// export async function extendSession(
//   bookingId: string,
//   stationId: string,
//   minutes: number,
// ) {
//   const supabase = await createClient();

//   const { data: booking, error: fetchError } = await supabase
//     .from('bookings')
//     .select(
//       'device, extended_until, session_started_at, duration_hours, date, players, tier',
//     )
//     .eq('id', bookingId)
//     .single();

//   if (fetchError || !booking) throw new Error('Booking not found');
//   if (!booking.session_started_at)
//     throw new Error('Session has not started yet');

//   const actualEnd = new Date(booking.session_started_at);
//   actualEnd.setHours(actualEnd.getHours() + Number(booking.duration_hours));
//   const currentEnd = booking.extended_until
//     ? new Date(booking.extended_until)
//     : actualEnd;
//   const newEnd = new Date(currentEnd.getTime() + minutes * 60_000);

//   // conflict check — is this station booked by someone else before newEnd?
//   const { data: conflicts, error: conflictError } = await supabase
//     .from('bookings')
//     .select('id, start_time')
//     .eq('station_id', stationId)
//     .eq('date', booking.date)
//     .in('status', ['confirmed'])
//     .neq('id', bookingId);

//   if (conflictError) throw new Error(conflictError.message);

//   const hasConflict = conflicts?.some((c) => {
//     const nextStart = new Date(`${booking.date}T${c.start_time}`);
//     return nextStart < newEnd;
//   });

//   if (hasConflict) {
//     return {
//       ok: false as const,
//       reason: 'Station is booked right after — cannot extend.',
//     };
//   }

//   const { error: updateError } = await supabase
//     .from('bookings')
//     .update({ extended_until: newEnd.toISOString() })
//     .eq('id', bookingId);

//   if (updateError) throw new Error(updateError.message);

//   const resolvedTier = resolveExtensionTier(
//     booking.device,
//     booking.players,
//     booking.tier,
//   );
//   const amount = getExtensionAmount(
//     pricing,
//     booking.device,
//     resolvedTier,
//     minutes,
//   );

//   const { error: insertError } = await supabase
//     .from('session_extensions')
//     .insert({
//       booking_id: bookingId,
//       minutes,
//       amount,
//       payment_status: 'pending',
//     });

//   if (insertError) throw new Error(insertError.message);

//   return { ok: true as const, amountDue: amount };
// }
export async function extendSession(
  bookingId: string,
  stationId: string,
  minutes: number,
) {
  const supabase = await createClient();

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select(
      'device, extended_until, session_started_at, duration_hours, date, players, tier',
    )
    .eq('id', bookingId)
    .single();

  if (fetchError || !booking) throw new Error('Booking not found');
  if (!booking.session_started_at)
    throw new Error('Session has not started yet');

  const actualEnd = new Date(booking.session_started_at);
  actualEnd.setHours(actualEnd.getHours() + Number(booking.duration_hours));
  const currentEnd = booking.extended_until
    ? new Date(booking.extended_until)
    : actualEnd;
  const newEnd = new Date(currentEnd.getTime() + minutes * 60_000);

  // conflict check — is this station booked by someone else before newEnd?
  const { data: conflicts, error: conflictError } = await supabase
    .from('bookings')
    .select('id, start_time')
    .eq('station_id', stationId)
    .eq('date', booking.date)
    .in('status', ['confirmed'])
    .neq('id', bookingId);

  if (conflictError) throw new Error(conflictError.message);

  const hasConflict = conflicts?.some((c) => {
    const nextStart = new Date(`${booking.date}T${c.start_time}`);
    return nextStart < newEnd;
  });

  if (hasConflict) {
    return {
      ok: false as const,
      reason: 'Station is booked right after — cannot extend.',
    };
  }

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ extended_until: newEnd.toISOString() })
    .eq('id', bookingId);

  if (updateError) throw new Error(updateError.message);

  const resolvedTier = resolveExtensionTier(
    booking.device,
    booking.players,
    booking.tier,
  );

  // Fetch just the one matching price row directly — this is a server
  // action, not a component, so the useExtensionPricing() hook can't be
  // called here.
  const { data: priceRow, error: priceError } = await supabase
    .from('extension_pricing')
    .select('price')
    .eq('device', booking.device)
    .eq('tier', resolvedTier)
    .eq('duration_minutes', minutes)
    .maybeSingle();

  if (priceError) throw new Error(priceError.message);

  if (!priceRow) {
    console.warn(
      `No extension price found for device=${booking.device} tier=${resolvedTier} minutes=${minutes}`,
    );
  }

  const amount = priceRow?.price ?? 0;

  const { error: insertError } = await supabase
    .from('session_extensions')
    .insert({
      booking_id: bookingId,
      minutes,
      amount,
      payment_status: 'pending',
    });

  if (insertError) throw new Error(insertError.message);

  return { ok: true as const, amountDue: amount };
}
export async function markExtensionPaid(extensionId: string) {
  const { user } = await requireRole(['owner', 'staff']);
  const supabase = await createClient();

  const { error } = await supabase
    .from('session_extensions')
    .update({ payment_status: 'paid', marked_paid_by: user.id })
    .eq('id', extensionId)
    .eq('payment_status', 'pending'); // no-op if already paid, avoids double-marking noise

  if (error) throw new Error(error.message);
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
  const cafeSettings = await getCafeSettings();

  const rate = getDisplayRate({
    device: values.device,
    players: values.players,
    tier: values.tier,
    fallbackRate: station.hourly_rate,
    settings: cafeSettings,
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
  const cafeSettings = await getCafeSettings();

  const rate = getDisplayRate({
    device: values.device,
    players: values.players,
    tier: values.tier,
    fallbackRate: station.hourly_rate,
    settings: cafeSettings,
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
