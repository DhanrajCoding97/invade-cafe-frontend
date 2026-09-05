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

export async function getRpc() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_my_role');
}

// export async function startSession(bookingId: string) {
//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from('bookings')
//     .update({ session_started_at: new Date().toISOString() })
//     .eq('id', bookingId);

//   if (error) throw new Error(error.message);
//   revalidatePath('/dashboard/staff');
// }

// export async function endSession(bookingId: string) {
//   const supabase = await createClient();

//   // 1. Get the booking and station name before updating it
//   const { data: booking, error: bookingError } = await supabase
//     .from('bookings')
//     .select(
//       `
//       id,
//       station_id,
//       status,
//       stations (
//         name
//       )
//     `,
//     )
//     .eq('id', bookingId)
//     .single();

//   if (bookingError) {
//     throw new Error(bookingError.message);
//   }

//   if (!booking) {
//     throw new Error('Booking not found');
//   }

//   // Prevent ending an already completed/cancelled booking
//   if (booking.status === 'completed') {
//     throw new Error('Session has already ended');
//   }

//   if (booking.status === 'cancelled') {
//     throw new Error('Cannot end a cancelled booking');
//   }

//   // Supabase relation can be an object or array depending on relationship
//   const station = Array.isArray(booking.stations)
//     ? booking.stations[0]
//     : booking.stations;

//   const stationName = station?.name ?? 'Station';

//   // 2. End the session
//   const { error: updateError } = await supabase
//     .from('bookings')
//     .update({
//       session_ended_at: new Date().toISOString(),
//       status: 'completed',
//     })
//     .eq('id', bookingId);

//   if (updateError) {
//     throw new Error(updateError.message);
//   }

//   // 3. Notify staff + owners
//   // Don't fail the session-ending operation if push notification fails.
//   try {
//     await sendPushToStaffAndOwners({
//       title: 'Session ended',
//       body: `${stationName} — session has ended`,
//       url: '/dashboard/staff',
//     });
//   } catch (error) {
//     console.error('Failed to send session-ended push notification:', error);
//   }

//   // 4. Refresh the staff dashboard
//   revalidatePath('/dashboard/staff');

//   return {
//     success: true,
//   };
// }

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

//   let hasConflict = false;
//   let conflictReason = 'Station is booked right after — cannot extend.';

//   if (booking.device === 'vr') {
//     // VR is one shared headset across every PS5 — check it globally,
//     // not just against this station's own bookings.
//     const { data: vrData, error: vrError } = await supabase.rpc(
//       'get_vr_conflict_after',
//       {
//         p_date: booking.date,
//         p_after: currentEnd.toISOString(),
//         p_new_end: newEnd.toISOString(),
//         p_exclude_booking_id: bookingId,
//       },
//     );
//     if (vrError) throw new Error(vrError.message);

//     hasConflict = !!vrData?.[0]?.conflict_start;
//     conflictReason =
//       'VR is booked right after on another station — cannot extend.';
//   } else {
//     const { data: conflicts, error: conflictError } = await supabase
//       .from('bookings')
//       .select('id, start_time')
//       .eq('station_id', stationId)
//       .eq('date', booking.date)
//       .in('status', ['confirmed'])
//       .neq('id', bookingId);

//     if (conflictError) throw new Error(conflictError.message);

//     hasConflict =
//       conflicts?.some((c) => {
//         const nextStart = new Date(`${booking.date}T${c.start_time}`);
//         return nextStart < newEnd;
//       }) ?? false;
//   }

//   if (hasConflict) {
//     return { ok: false as const, reason: conflictReason };
//   }

//   const { error: updateError } = await supabase
//     .from('bookings')
//     .update({ extended_until: newEnd.toISOString() })
//     .eq('id', bookingId);

//   if (updateError) {
//     // Belt-and-suspenders: our manual pre-check above can race with
//     // another extend/booking happening at the same instant. The DB's
//     // exclusion constraint is the real guard — this just gives a clean
//     // message instead of a raw Postgres error if that race is ever hit.
//     if (updateError.code === '23P01') {
//       return {
//         ok: false as const,
//         reason:
//           booking.device === 'vr'
//             ? 'VR is booked right after on another station — cannot extend.'
//             : 'Station is booked right after — cannot extend.',
//       };
//     }
//     throw new Error(updateError.message);
//   }

//   const resolvedTier = resolveExtensionTier(
//     booking.device,
//     booking.players,
//     booking.tier,
//   );

//   const { data: priceRow, error: priceError } = await supabase
//     .from('extension_pricing')
//     .select('price')
//     .eq('device', booking.device)
//     .eq('tier', resolvedTier)
//     .eq('duration_minutes', minutes)
//     .maybeSingle();

//   if (priceError) throw new Error(priceError.message);

//   if (!priceRow) {
//     console.warn(
//       `No extension price found for device=${booking.device} tier=${resolvedTier} minutes=${minutes}`,
//     );
//   }

//   const amount = priceRow?.price ?? 0;

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

//   // Fetch just the one matching price row directly — this is a server
//   // action, not a component, so the useExtensionPricing() hook can't be
//   // called here.
//   const { data: priceRow, error: priceError } = await supabase
//     .from('extension_pricing')
//     .select('price')
//     .eq('device', booking.device)
//     .eq('tier', resolvedTier)
//     .eq('duration_minutes', minutes)
//     .maybeSingle();

//   if (priceError) throw new Error(priceError.message);

//   if (!priceRow) {
//     console.warn(
//       `No extension price found for device=${booking.device} tier=${resolvedTier} minutes=${minutes}`,
//     );
//   }

//   const amount = priceRow?.price ?? 0;

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
export async function startSession(
  bookingId: string,
  linkedBookingId?: string,
) {
  const supabase = await createClient();
  const ids = linkedBookingId ? [bookingId, linkedBookingId] : [bookingId];

  const { error } = await supabase
    .from('bookings')
    .update({ session_started_at: new Date().toISOString() })
    .in('id', ids);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/staff');
}

export async function endSession(bookingId: string, linkedBookingId?: string) {
  const supabase = await createClient();
  const ids = linkedBookingId ? [bookingId, linkedBookingId] : [bookingId];

  const { data: rows, error: bookingError } = await supabase
    .from('bookings')
    .select(`id, status, stations ( name )`)
    .in('id', ids);

  if (bookingError) throw new Error(bookingError.message);
  if (!rows || rows.length === 0) throw new Error('Booking not found');

  const primary = rows.find((r) => r.id === bookingId) ?? rows[0];
  if (primary.status === 'completed')
    throw new Error('Session has already ended');
  if (primary.status === 'cancelled')
    throw new Error('Cannot end a cancelled booking');

  const stationLabel = rows
    .map((r) => {
      const station = Array.isArray(r.stations) ? r.stations[0] : r.stations;
      return station?.name ?? 'Station';
    })
    .join(' + ');

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ session_ended_at: new Date().toISOString(), status: 'completed' })
    .in('id', ids);

  if (updateError) throw new Error(updateError.message);

  try {
    await sendPushToStaffAndOwners({
      title: 'Session ended',
      body: `${stationLabel} — session has ended`,
      url: '/dashboard/staff',
    });
  } catch (error) {
    console.error('Failed to send session-ended push notification:', error);
  }

  revalidatePath('/dashboard/staff');
  return { success: true };
}

async function extendSingleStation(
  supabase: any,
  bookingId: string,
  stationId: string,
  minutes: number,
) {
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select(
      'device, extended_until, session_started_at, duration_hours, date, players, tier',
    )
    .eq('id', bookingId)
    .single();

  if (fetchError || !booking)
    return { ok: false as const, reason: 'Booking not found' };
  if (!booking.session_started_at)
    return { ok: false as const, reason: 'Session has not started yet' };

  const actualEnd = new Date(booking.session_started_at);
  actualEnd.setHours(actualEnd.getHours() + Number(booking.duration_hours));
  const currentEnd = booking.extended_until
    ? new Date(booking.extended_until)
    : actualEnd;
  const newEnd = new Date(currentEnd.getTime() + minutes * 60_000);

  let hasConflict = false;
  let conflictReason = 'Station is booked right after — cannot extend.';

  if (booking.device === 'vr') {
    const { data: vrData, error: vrError } = await supabase.rpc(
      'get_vr_conflict_after',
      {
        p_date: booking.date,
        p_after: currentEnd.toISOString(),
        p_new_end: newEnd.toISOString(),
        p_exclude_booking_id: bookingId,
      },
    );
    if (vrError) return { ok: false as const, reason: vrError.message };
    hasConflict = !!vrData?.[0]?.conflict_start;
    conflictReason =
      'VR is booked right after on another station — cannot extend.';
  } else {
    const { data: conflicts, error: conflictError } = await supabase
      .from('bookings')
      .select('id, start_time')
      .eq('station_id', stationId)
      .eq('date', booking.date)
      .in('status', ['confirmed'])
      .neq('id', bookingId);

    if (conflictError)
      return { ok: false as const, reason: conflictError.message };

    hasConflict =
      conflicts?.some((c: any) => {
        const nextStart = new Date(`${booking.date}T${c.start_time}`);
        return nextStart < newEnd;
      }) ?? false;
  }

  if (hasConflict) return { ok: false as const, reason: conflictReason };

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ extended_until: newEnd.toISOString() })
    .eq('id', bookingId);

  if (updateError) {
    if (updateError.code === '23P01') {
      return {
        ok: false as const,
        reason:
          booking.device === 'vr'
            ? 'VR is booked right after on another station — cannot extend.'
            : 'Station is booked right after — cannot extend.',
      };
    }
    return { ok: false as const, reason: updateError.message };
  }

  return {
    ok: true as const,
    previousExtendedUntil: booking.extended_until as string | null,
    device: booking.device as string,
    players: booking.players as number,
    tier: booking.tier as string | null,
  };
}

export async function extendSession(
  bookingId: string,
  stationId: string,
  minutes: number,
  linkedBookingId?: string,
  linkedStationId?: string,
) {
  const supabase = await createClient();

  const primary = await extendSingleStation(
    supabase,
    bookingId,
    stationId,
    minutes,
  );
  if (!primary.ok) return { ok: false as const, reason: primary.reason };

  if (linkedBookingId && linkedStationId) {
    const secondary = await extendSingleStation(
      supabase,
      linkedBookingId,
      linkedStationId,
      minutes,
    );
    if (!secondary.ok) {
      // Roll back the primary so the two stations' clocks don't drift apart.
      await supabase
        .from('bookings')
        .update({ extended_until: primary.previousExtendedUntil })
        .eq('id', bookingId);
      return { ok: false as const, reason: secondary.reason };
    }
  }

  const resolvedTier = resolveExtensionTier(
    primary.device,
    primary.players,
    primary.tier,
  );

  const { data: priceRow, error: priceError } = await supabase
    .from('extension_pricing')
    .select('price')
    .eq('device', primary.device)
    .eq('tier', resolvedTier)
    .eq('duration_minutes', minutes)
    .maybeSingle();

  if (priceError) throw new Error(priceError.message);

  if (!priceRow) {
    console.warn(
      `No extension price found for device=${primary.device} tier=${resolvedTier} minutes=${minutes}`,
    );
  }

  const amount = priceRow?.price ?? 0;

  // Charged once, against the primary row only — matches the same
  // one-payment-per-group model your booking creation already uses.
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

// export async function createManualBooking(values: ManualBookingValues) {
//   await requireRole(['owner', 'staff']);
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   // Fetch the station server-side — never trust a client-sent rate/total
//   const { data: station, error: stationError } = await supabase
//     .from('stations')
//     .select('hourly_rate')
//     .eq('id', values.stationId)
//     .single();

//   if (stationError || !station) {
//     throw new Error('Selected station not found.');
//   }
//   const cafeSettings = await getCafeSettings();

//   const rate = getDisplayRate({
//     device: values.device,
//     players: values.players,
//     tier: values.tier,
//     fallbackRate: station.hourly_rate,
//     settings: cafeSettings,
//   });
//   const computedTotal = calculateTotal(rate, values.duration);

//   const total =
//     values.paymentMethod === 'complimentary'
//       ? 0
//       : (values.amountOverride ?? computedTotal);

//   const { data, error } = await supabase
//     .from('bookings')
//     .insert({
//       station_id: values.stationId,
//       device: values.device,
//       tier: values.tier ?? null,
//       players: values.players,
//       duration_hours: values.duration,
//       date: format(values.date, 'yyyy-MM-dd'),
//       start_time: values.startTime,
//       amount: total,
//       status: 'confirmed',
//       user_id: null,
//       staff_id: user?.id ?? null,

//       customer_name: values.customerName,
//       customer_phone: values.customerPhone,
//       customer_email: values.customerEmail,

//       other_names: values.otherNames?.length ? values.otherNames : null,

//       amount_override: values.amountOverride ?? null,

//       payment_method: values.paymentMethod,
//       session_started_at: values.startNow ? new Date().toISOString() : null,
//     })
//     .select('id')
//     .single();

//   if (error) {
//     if (
//       error.code === '23505' ||
//       error.message?.toLowerCase().includes('conflict')
//     ) {
//       throw new Error('That station was just booked — pick another one.');
//     }
//     throw new Error(error.message);
//   }

//   return data.id;
// }

// export async function updateManualBooking(
//   bookingId: string,
//   values: ManualBookingValues,
// ) {
//   await requireRole(['owner', 'staff']);
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   // Fetch the station server-side — never trust a client-sent rate/total
//   const { data: station, error: stationError } = await supabase
//     .from('stations')
//     .select('hourly_rate')
//     .eq('id', values.stationId)
//     .single();

//   if (stationError || !station) {
//     throw new Error('Selected station not found.');
//   }
//   const cafeSettings = await getCafeSettings();

//   const rate = getDisplayRate({
//     device: values.device,
//     players: values.players,
//     tier: values.tier,
//     fallbackRate: station.hourly_rate,
//     settings: cafeSettings,
//   });
//   const computedTotal = calculateTotal(rate, values.duration);

//   const total =
//     values.paymentMethod === 'complimentary'
//       ? 0
//       : (values.amountOverride ?? computedTotal);

//   const { error } = await supabase
//     .from('bookings')
//     .update({
//       station_id: values.stationId,
//       device: values.device,
//       tier: values.tier ?? null,
//       players: values.players,
//       duration_hours: values.duration,
//       date: format(values.date, 'yyyy-MM-dd'),
//       start_time: values.startTime,
//       amount: total,
//       customer_name: values.customerName,
//       customer_phone: values.customerPhone,
//       customer_email: values.customerEmail,

//       other_names: values.otherNames?.length ? values.otherNames : null,
//       amount_override: values.amountOverride ?? null,
//       payment_method: values.paymentMethod,
//     })
//     .eq('id', bookingId);

//   if (error) {
//     if (
//       error.code === '23505' ||
//       error.message?.toLowerCase().includes('conflict')
//     ) {
//       throw new Error('That station was just booked — pick another one.');
//     }
//     throw new Error(error.message);
//   }
// }

export async function createManualBooking(values: ManualBookingValues) {
  await requireRole(['owner', 'staff']);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const stationIdsToFetch = values.linkedStationId
    ? [values.stationId, values.linkedStationId]
    : [values.stationId];

  const { data: stationRows, error: stationError } = await supabase
    .from('stations')
    .select('id, hourly_rate')
    .in('id', stationIdsToFetch);

  if (
    stationError ||
    !stationRows ||
    stationRows.length !== stationIdsToFetch.length
  ) {
    throw new Error('Selected station not found.');
  }

  const primaryStation = stationRows.find((s) => s.id === values.stationId)!;

  const cafeSettings = await getCafeSettings();

  // For a combo, this rate is already the combined price (racing_multiplayer_rate) —
  // don't multiply by station count.
  const rate = getDisplayRate({
    device: values.device,
    players: values.players,
    tier: values.tier,
    fallbackRate: primaryStation.hourly_rate,
    settings: cafeSettings,
  });
  const computedTotal = calculateTotal(rate, values.duration);

  const total =
    values.paymentMethod === 'complimentary'
      ? 0
      : (values.amountOverride ?? computedTotal);

  const dateStr = format(values.date, 'yyyy-MM-dd');

  if (values.linkedStationId) {
    const { data: groupBookingId, error: groupError } = await supabase.rpc(
      'create_group_booking_manual',
      {
        p_station_id_1: values.stationId,
        p_station_id_2: values.linkedStationId,
        p_device: values.device,
        p_tier: values.tier ?? null,
        p_players: values.players,
        p_duration_hours: values.duration,
        p_date: dateStr,
        p_start_time: values.startTime,
        p_amount: total,
        p_customer_name: values.customerName,
        p_customer_phone: values.customerPhone,
        p_customer_email: values.customerEmail,
        p_other_names: values.otherNames?.length ? values.otherNames : null,
        p_amount_override: values.amountOverride ?? null,
        p_payment_method: values.paymentMethod,
        p_staff_id: user?.id ?? null,
        p_session_started_at: values.startNow ? new Date().toISOString() : null,
      },
    );

    if (groupError) {
      const isSlotConflict =
        groupError.code === '23P01' ||
        groupError.message.includes('no_overlapping_bookings');
      if (isSlotConflict) {
        throw new Error(
          'One of those stations was just booked — pick another pair.',
        );
      }
      throw new Error(groupError.message);
    }

    return groupBookingId as string;
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      station_id: values.stationId,
      device: values.device,
      tier: values.tier ?? null,
      players: values.players,
      duration_hours: values.duration,
      date: dateStr,
      start_time: values.startTime,
      amount: total,
      status: 'confirmed',
      user_id: null,
      staff_id: user?.id ?? null,
      customer_name: values.customerName,
      customer_phone: values.customerPhone,
      customer_email: values.customerEmail,
      other_names: values.otherNames?.length ? values.otherNames : null,
      amount_override: values.amountOverride ?? null,
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

  const { data: existing, error: existingError } = await supabase
    .from('bookings')
    .select('group_id, is_group_primary, station_id')
    .eq('id', bookingId)
    .single();

  if (existingError || !existing) {
    throw new Error('Booking not found.');
  }

  const cafeSettings = await getCafeSettings();

  // Structural fields (station/device/tier/date/time/duration) are locked
  // for group bookings — only contact info, amount, and payment method
  // are editable. Recompute rate/total from the EXISTING station, never
  // trust values.stationId for a group booking since the form should have
  // it disabled anyway.
  const { data: station, error: stationError } = await supabase
    .from('stations')
    .select('hourly_rate')
    .eq('id', existing.station_id)
    .single();

  if (stationError || !station) {
    throw new Error('Station not found.');
  }

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

  const sharedFields = {
    customer_name: values.customerName,
    customer_phone: values.customerPhone,
    customer_email: values.customerEmail,
    payment_method: values.paymentMethod,
  };

  if (existing.group_id) {
    // Group booking: update contact/payment fields on BOTH rows so they
    // stay in sync, but amount/amount_override/other_names only belong
    // on the primary row (matches the create-time convention where the
    // secondary row's amount is always 0).
    const { error: groupError } = await supabase
      .from('bookings')
      .update(sharedFields)
      .eq('group_id', existing.group_id);

    if (groupError) throw new Error(groupError.message);

    const { error: primaryError } = await supabase
      .from('bookings')
      .update({
        amount: total,
        amount_override: values.amountOverride ?? null,
        other_names: values.otherNames?.length ? values.otherNames : null,
      })
      .eq('id', bookingId);

    if (primaryError) throw new Error(primaryError.message);
    return;
  }

  // Non-group booking: original single-row update path, unchanged.
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
      ...sharedFields,
      other_names: values.otherNames?.length ? values.otherNames : null,
      amount_override: values.amountOverride ?? null,
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
