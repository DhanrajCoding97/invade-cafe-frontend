// lib/actions/bookings.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth/requrireRole';
import { PaymentMethod, PaymentStatus } from '@/types';
import { refundPayment } from './refund';
// export async function cancelBooking(bookingId: string) {
//   await requireRole(['owner', 'staff']);
//   const supabase = await createClient();
//   const { error } = await supabase
//     .from('bookings')
//     .update({ status: 'cancelled' })
//     .eq('id', bookingId);
//   if (error) throw new Error(error.message);
// }

// export async function cancelBooking(bookingId: string) {
//   await requireRole(['owner', 'staff']);
//   const supabase = await createClient();

//   const { data: booking, error: fetchError } = await supabase
//     .from('bookings')
//     .select('payment_status, payment_method, razorpay_payment_id, amount')
//     .eq('id', bookingId)
//     .single();

//   if (fetchError || !booking) {
//     throw new Error(fetchError?.message ?? 'Booking not found');
//   }

//   const needsRefund =
//     booking.payment_status === 'paid' &&
//     booking.payment_method === 'razorpay' &&
//     !!booking.razorpay_payment_id;

//   if (needsRefund) {
//     const refundRes = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/razorpay/refund`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ paymentId: booking.razorpay_payment_id }),
//       },
//     );

//     if (!refundRes.ok) {
//       const body = await refundRes.json().catch(() => ({}));
//       throw new Error(body.error ?? 'Refund failed — booking not cancelled');
//     }
//     // refund route already sets payment_status to 'refunded'
//   }

//   const { error } = await supabase
//     .from('bookings')
//     .update({ status: 'cancelled' })
//     .eq('id', bookingId);

//   if (error) throw new Error(error.message);
// }

export async function cancelBooking(bookingId: string) {
  await requireRole(['owner', 'staff']);
  const supabase = await createClient();

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('payment_status, payment_method, razorpay_payment_id')
    .eq('id', bookingId)
    .single();

  if (fetchError || !booking) {
    throw new Error(fetchError?.message ?? 'Booking not found');
  }

  const needsRefund =
    booking.payment_status === 'paid' &&
    booking.payment_method === 'razorpay' &&
    !!booking.razorpay_payment_id;

  if (needsRefund) {
    await refundPayment(booking.razorpay_payment_id!); // throws → cancel aborts, caught by mutation's onError
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);

  if (error) throw new Error(error.message);
}

export async function updatePaymentStatus(
  bookingId: string,
  status: PaymentStatus,
  method?: PaymentMethod,
) {
  await requireRole(['owner', 'staff']);
  const supabase = await createClient();
  const { error } = await supabase
    .from('bookings')
    .update({
      payment_status: status,
      ...(method && { payment_method: method }),
    })
    .eq('id', bookingId);
  if (error) throw new Error(error.message);
}

// export async function updatePaymentStatus(
//   bookingId: string,
//   status: string,
//   method: string,
// ) {
//   await requireRole(['owner', 'staff']);
//   const supabase = await createClient();
//   const { error } = await supabase
//     .from('bookings')
//     .update({ payment_status: status, payment_method: method })
//     .eq('id', bookingId);
//   if (error) throw new Error(error.message);
// }

export async function markNoShow(bookingId: string) {
  await requireRole(['owner', 'staff']);
  const supabase = await createClient();
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'no_show' }) // no payment_status change — no refund
    .eq('id', bookingId);
  if (error) throw new Error(error.message);
}
