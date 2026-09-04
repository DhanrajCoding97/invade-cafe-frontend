// // lib/razorpay/create-booking-from-payment.ts
// import Razorpay from 'razorpay';
// import { createClient } from '@/lib/supabase/server'; // adjust to your actual server client import
// import type { SupabaseClient } from '@supabase/supabase-js';

// function getConflictMessage(stationName: string, refunded: boolean) {
//   return refunded
//     ? `${stationName} was just booked by another customer. Your payment has been refunded. Please choose another station for the same time slot.`
//     : `${stationName} was just booked by another customer. Your refund is being processed manually. Our team has been notified.`;
// }

// type CreateBookingResult =
//   | { ok: true; bookingId: string }
//   | { ok: false; status: number; body: Record<string, unknown> };

// export async function createBookingFromPayment({
//   razorpay_payment_id,
//   razorpay_order_id,
//   userId,
//   supabase: injectedSupabase,
// }: {
//   razorpay_payment_id: string;
//   razorpay_order_id: string;
//   userId: string;
//   supabase?: SupabaseClient;
// }): Promise<CreateBookingResult> {
//   const keyId = process.env.RAZORPAY_KEY_ID;
//   const keySecret = process.env.RAZORPAY_KEY_SECRET;

//   if (!keyId || !keySecret) {
//     return {
//       ok: false,
//       status: 500,
//       body: { error: 'Missing Razorpay credentials' },
//     };
//   }

//   const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
//   const order = await razorpay.orders.fetch(razorpay_order_id);
//   const notes = (order.notes ?? {}) as Record<string, string>;

//   const supabase = injectedSupabase ?? (await createClient());

//   const { data: existingByPaymentId } = await supabase
//     .from('bookings')
//     .select('id')
//     .eq('razorpay_payment_id', razorpay_payment_id)
//     .maybeSingle();

//   if (existingByPaymentId) {
//     return { ok: true, bookingId: existingByPaymentId.id };
//   }

//   const { data: station } = await supabase
//     .from('stations')
//     .select('name')
//     .eq('id', notes.stationId)
//     .single();

//   const stationName = station?.name ?? 'The selected station';

//   // Normalize date — notes.date may arrive as a full ISO timestamp
//   // depending on how the client serialized it, but everything downstream
//   // (DB column, conflict-check math) expects 'yyyy-MM-dd'.
//   const datePart = notes.date.slice(0, 10);

//   // ---- Conflict check (fast-path UX; the DB exclusion constraint + unique
//   // payment_id constraint are the real guarantees) ----
//   const requestedStart = new Date(`${datePart}T${notes.startTime}`);
//   const requestedEnd = new Date(requestedStart);
//   requestedEnd.setHours(requestedEnd.getHours() + Number(notes.duration));

//   const { data: existingBookings, error: conflictError } = await supabase
//     .from('bookings')
//     .select('id, start_time, duration_hours')
//     .eq('station_id', notes.stationId)
//     .eq('date', datePart)
//     .in('status', ['pending', 'confirmed']);

//   if (conflictError) {
//     console.error('Conflict check failed:', conflictError);
//     return {
//       ok: false,
//       status: 500,
//       body: { error: 'Could not verify slot availability' },
//     };
//   }

//   const hasConflict = (existingBookings ?? []).some((b) => {
//     const bStart = new Date(`${datePart}T${b.start_time}`);
//     const bEnd = new Date(bStart);
//     bEnd.setHours(bEnd.getHours() + Number(b.duration_hours));
//     return requestedStart < bEnd && bStart < requestedEnd;
//   });

//   if (hasConflict) {
//     console.error('Double-booking prevented at verify stage:', {
//       stationId: notes.stationId,
//       date: datePart,
//       startTime: notes.startTime,
//     });

//     const refunded = await attemptRefund({
//       razorpay,
//       supabase,
//       razorpay_payment_id,
//       razorpay_order_id,
//       amount: Number(order.amount),
//       userId,
//       reason: 'slot_conflict_at_verify',
//       notes,
//     });

//     return {
//       ok: false,
//       status: 409,
//       body: {
//         error: getConflictMessage(stationName, refunded),
//         code: 'SLOT_CONFLICT',
//         refunded,
//       },
//     };
//   }
//   // ---- end conflict check ----

//   const { data: booking, error } = await supabase
//     .from('bookings')
//     .insert({
//       station_id: notes.stationId,
//       device: notes.device,
//       tier: notes.tier || null,
//       players: Number(notes.players),
//       duration_hours: Number(notes.duration),
//       date: datePart,
//       start_time: notes.startTime,
//       amount: Number(order.amount) / 100,
//       razorpay_payment_id,
//       razorpay_order_id,
//       payment_method: 'razorpay',
//       payment_status: 'paid',
//       status: 'confirmed',
//       user_id: userId,
//     })
//     .select('id')
//     .single();

//   if (error) {
//     // Already created by the other path (webhook vs. client verify race) — not an error.
//     if (
//       error.code === '23505' &&
//       error.message.includes('unique_razorpay_payment_id')
//     ) {
//       const { data: existing } = await supabase
//         .from('bookings')
//         .select('id')
//         .eq('razorpay_payment_id', razorpay_payment_id)
//         .single();

//       if (existing) {
//         return { ok: true, bookingId: existing.id };
//       }
//     }

//     const isSlotConflict =
//       error.code === '23505' ||
//       error.message.includes('no_overlapping_bookings');

//     if (isSlotConflict) {
//       console.error('Double-booking prevented by DB constraint:', {
//         stationId: notes.stationId,
//         date: datePart,
//         startTime: notes.startTime,
//       });

//       const refunded = await attemptRefund({
//         razorpay,
//         supabase,
//         razorpay_payment_id,
//         razorpay_order_id,
//         amount: Number(order.amount),
//         userId,
//         reason: 'slot_conflict_db_constraint',
//         notes,
//       });

//       return {
//         ok: false,
//         status: 409,
//         body: {
//           error: getConflictMessage(stationName, refunded),
//           code: 'SLOT_CONFLICT',
//           refunded,
//         },
//       };
//     }

//     console.error('Supabase Insert Error:', error);
//     return {
//       ok: false,
//       status: 500,
//       body: { error: error.message, details: error },
//     };
//   }

//   return { ok: true, bookingId: booking.id };
// }

// async function attemptRefund({
//   razorpay,
//   supabase,
//   razorpay_payment_id,
//   razorpay_order_id,
//   amount,
//   userId,
//   reason,
//   notes,
// }: {
//   razorpay: Razorpay;
//   supabase: SupabaseClient;
//   razorpay_payment_id: string;
//   razorpay_order_id: string;
//   amount: number;
//   userId: string;
//   reason: string;
//   notes: Record<string, string>;
// }): Promise<boolean> {
//   try {
//     await razorpay.payments.refund(razorpay_payment_id, {
//       amount,
//       speed: 'optimum',
//       notes: { reason, ...notes },
//     });
//     return true;
//   } catch (refundErr) {
//     console.error('❌ Refund failed — needs manual reconciliation:', {
//       razorpay_payment_id,
//       error: refundErr,
//     });
//     await supabase.from('failed_refunds').insert({
//       razorpay_payment_id,
//       razorpay_order_id,
//       user_id: userId,
//       amount: amount / 100,
//       reason,
//       notes,
//     });
//     return false;
//   }
// }
// lib/razorpay/create-booking-from-payment.ts
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';

function getConflictMessage(stationName: string, refunded: boolean) {
  return refunded
    ? `${stationName} was just booked by another customer. Your payment has been refunded. Please choose another station for the same time slot.`
    : `${stationName} was just booked by another customer. Your refund is being processed manually. Our team has been notified.`;
}

type CreateBookingResult =
  | { ok: true; bookingId: string }
  | { ok: false; status: number; body: Record<string, unknown> };

export async function createBookingFromPayment({
  razorpay_payment_id,
  razorpay_order_id,
  userId,
  supabase: injectedSupabase,
}: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  userId: string;
  supabase?: SupabaseClient;
}): Promise<CreateBookingResult> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return {
      ok: false,
      status: 500,
      body: { error: 'Missing Razorpay credentials' },
    };
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await razorpay.orders.fetch(razorpay_order_id);
  const notes = (order.notes ?? {}) as Record<string, string>;
  const linkedStationId = notes.linkedStationId || null;

  const supabase = injectedSupabase ?? (await createClient());

  const { data: existingByPaymentId } = await supabase
    .from('bookings')
    .select('id')
    .eq('razorpay_payment_id', razorpay_payment_id)
    .maybeSingle();

  if (existingByPaymentId) {
    return { ok: true, bookingId: existingByPaymentId.id };
  }

  const stationIdsInvolved = linkedStationId
    ? [notes.stationId, linkedStationId]
    : [notes.stationId];

  const { data: stationRows } = await supabase
    .from('stations')
    .select('id, name')
    .in('id', stationIdsInvolved);

  const stationNamesById = new Map(
    (stationRows ?? []).map((s) => [s.id, s.name]),
  );
  const stationLabel = stationIdsInvolved
    .map((id) => stationNamesById.get(id) ?? 'The selected station')
    .join(' + ');

  const datePart = notes.date.slice(0, 10);

  // ---- Conflict check (fast-path UX; the DB exclusion constraint + unique
  // payment_id constraint are the real guarantees) ----
  const requestedStart = new Date(`${datePart}T${notes.startTime}`);
  const requestedEnd = new Date(requestedStart);
  requestedEnd.setHours(requestedEnd.getHours() + Number(notes.duration));

  const { data: existingBookings, error: conflictError } = await supabase
    .from('bookings')
    .select('id, start_time, duration_hours')
    .in('station_id', stationIdsInvolved)
    .eq('date', datePart)
    .in('status', ['pending', 'confirmed']);

  if (conflictError) {
    console.error('Conflict check failed:', conflictError);
    return {
      ok: false,
      status: 500,
      body: { error: 'Could not verify slot availability' },
    };
  }

  const hasConflict = (existingBookings ?? []).some((b) => {
    const bStart = new Date(`${datePart}T${b.start_time}`);
    const bEnd = new Date(bStart);
    bEnd.setHours(bEnd.getHours() + Number(b.duration_hours));
    return requestedStart < bEnd && bStart < requestedEnd;
  });

  if (hasConflict) {
    console.error('Double-booking prevented at verify stage:', {
      stationIds: stationIdsInvolved,
      date: datePart,
      startTime: notes.startTime,
    });

    const refunded = await attemptRefund({
      razorpay,
      supabase,
      razorpay_payment_id,
      razorpay_order_id,
      amount: Number(order.amount),
      userId,
      reason: 'slot_conflict_at_verify',
      notes,
    });

    return {
      ok: false,
      status: 409,
      body: {
        error: getConflictMessage(stationLabel, refunded),
        code: 'SLOT_CONFLICT',
        refunded,
      },
    };
  }
  // ---- end conflict check ----

  // ---- Group booking (PC/PS5 racing combo) ----
  if (linkedStationId) {
    const { data: groupBookingId, error: groupError } = await supabase.rpc(
      'create_group_booking',
      {
        p_station_id_1: notes.stationId,
        p_station_id_2: linkedStationId,
        p_device: notes.device,
        p_tier: notes.tier || null,
        p_players: Number(notes.players),
        p_duration_hours: Number(notes.duration),
        p_date: datePart,
        p_start_time: notes.startTime,
        p_amount: Number(order.amount) / 100,
        p_razorpay_payment_id: razorpay_payment_id,
        p_razorpay_order_id: razorpay_order_id,
        p_user_id: userId,
      },
    );

    if (groupError) {
      // Payment id already used — another request (webhook vs verify race)
      // already created this booking.
      if (
        groupError.code === '23505' &&
        groupError.message.includes('razorpay_payment_id')
      ) {
        const { data: existing } = await supabase
          .from('bookings')
          .select('id')
          .eq('razorpay_payment_id', razorpay_payment_id)
          .single();
        if (existing) return { ok: true, bookingId: existing.id };
      }

      // Exclusion constraint violation on either station = slot conflict
      const isSlotConflict =
        groupError.code === '23P01' ||
        groupError.message.includes('no_overlapping_bookings');

      if (isSlotConflict) {
        console.error('Double-booking prevented by DB constraint (group):', {
          stationIds: stationIdsInvolved,
          date: datePart,
          startTime: notes.startTime,
        });

        const refunded = await attemptRefund({
          razorpay,
          supabase,
          razorpay_payment_id,
          razorpay_order_id,
          amount: Number(order.amount),
          userId,
          reason: 'slot_conflict_db_constraint',
          notes,
        });

        return {
          ok: false,
          status: 409,
          body: {
            error: getConflictMessage(stationLabel, refunded),
            code: 'SLOT_CONFLICT',
            refunded,
          },
        };
      }

      console.error('Supabase RPC Error (group booking):', groupError);
      return {
        ok: false,
        status: 500,
        body: { error: groupError.message, details: groupError },
      };
    }

    return { ok: true, bookingId: groupBookingId as string };
  }
  // ---- end group booking ----

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      station_id: notes.stationId,
      device: notes.device,
      tier: notes.tier || null,
      players: Number(notes.players),
      duration_hours: Number(notes.duration),
      date: datePart,
      start_time: notes.startTime,
      amount: Number(order.amount) / 100,
      razorpay_payment_id,
      razorpay_order_id,
      payment_method: 'razorpay',
      payment_status: 'paid',
      status: 'confirmed',
      user_id: userId,
    })
    .select('id')
    .single();

  if (error) {
    if (
      error.code === '23505' &&
      error.message.includes('unique_razorpay_payment_id')
    ) {
      const { data: existing } = await supabase
        .from('bookings')
        .select('id')
        .eq('razorpay_payment_id', razorpay_payment_id)
        .single();

      if (existing) {
        return { ok: true, bookingId: existing.id };
      }
    }

    const isSlotConflict =
      error.code === '23505' ||
      error.message.includes('no_overlapping_bookings');

    if (isSlotConflict) {
      console.error('Double-booking prevented by DB constraint:', {
        stationId: notes.stationId,
        date: datePart,
        startTime: notes.startTime,
      });

      const refunded = await attemptRefund({
        razorpay,
        supabase,
        razorpay_payment_id,
        razorpay_order_id,
        amount: Number(order.amount),
        userId,
        reason: 'slot_conflict_db_constraint',
        notes,
      });

      return {
        ok: false,
        status: 409,
        body: {
          error: getConflictMessage(stationLabel, refunded),
          code: 'SLOT_CONFLICT',
          refunded,
        },
      };
    }

    console.error('Supabase Insert Error:', error);
    return {
      ok: false,
      status: 500,
      body: { error: error.message, details: error },
    };
  }

  return { ok: true, bookingId: booking.id };
}

async function attemptRefund({
  razorpay,
  supabase,
  razorpay_payment_id,
  razorpay_order_id,
  amount,
  userId,
  reason,
  notes,
}: {
  razorpay: Razorpay;
  supabase: SupabaseClient;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  amount: number;
  userId: string;
  reason: string;
  notes: Record<string, string>;
}): Promise<boolean> {
  try {
    await razorpay.payments.refund(razorpay_payment_id, {
      amount,
      speed: 'optimum',
      notes: { reason, ...notes },
    });
    return true;
  } catch (refundErr) {
    console.error('❌ Refund failed — needs manual reconciliation:', {
      razorpay_payment_id,
      error: refundErr,
    });
    await supabase.from('failed_refunds').insert({
      razorpay_payment_id,
      razorpay_order_id,
      user_id: userId,
      amount: amount / 100,
      reason,
      notes,
    });
    return false;
  }
}
