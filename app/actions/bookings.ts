'use server';

import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth/requrireRole';
import { PaymentMethod, PaymentStatus } from '@/types';
import { refundPayment } from './refund';
import { getRefundPercentForCount } from '@/lib/cancellation-policy';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// export async function cancelBooking(bookingId: string) {
//   const { user, role } = await requireRole(['owner', 'staff']);
//   const supabase = await createClient();

//   const { data: booking, error: fetchError } = await supabase
//     .from('bookings')
//     .select(
//       'user_id, payment_status, payment_method, razorpay_payment_id, amount',
//     )
//     .eq('id', bookingId)
//     .single();

//   if (fetchError || !booking)
//     throw new Error(fetchError?.message ?? 'Booking not found');

//   const isOnlineBooking = booking.payment_method === 'razorpay';

//   if (isOnlineBooking && role !== 'owner') {
//     throw new Error(
//       'Only the owner can cancel online bookings. Please escalate.',
//     );
//   }

//   const startOfMonth = new Date();
//   startOfMonth.setDate(1);
//   startOfMonth.setHours(0, 0, 0, 0);

//   const { count: monthCount, error: monthErr } = await supabase
//     .from('bookings')
//     .select('*', { count: 'exact', head: true })
//     .eq('user_id', booking.user_id)
//     .eq('status', 'cancelled')
//     .gte('cancelled_at', startOfMonth.toISOString());
//   if (monthErr) throw new Error(monthErr.message);

//   const refundPercent = getRefundPercentForCount(monthCount ?? 0);

//   const needsRefund =
//     booking.payment_status === 'paid' &&
//     booking.payment_method === 'razorpay' &&
//     !!booking.razorpay_payment_id;

//   if (needsRefund) {
//     const refundAmountPaise = Math.round(
//       (booking.amount * 100 * refundPercent) / 100,
//     );
//     await refundPayment(booking.razorpay_payment_id!, {
//       amount: refundAmountPaise,
//       refundedBy: user.id,
//       reason: `admin_cancelled_${refundPercent}pct`,
//     });
//   }

//   const { error } = await supabase
//     .from('bookings')
//     .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
//     .eq('id', bookingId);

//   if (error) throw new Error(error.message);

//   return { refundPercent };
// }
export async function cancelBooking(bookingId: string) {
  const { user, role } = await requireRole(['owner', 'staff']);
  const supabase = await createClient();

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select(
      'user_id, payment_status, payment_method, razorpay_payment_id, amount',
    )
    .eq('id', bookingId)
    .single();

  if (fetchError || !booking)
    throw new Error(fetchError?.message ?? 'Booking not found');

  const isOnlineBooking = booking.payment_method === 'razorpay';

  if (isOnlineBooking && role !== 'owner') {
    throw new Error(
      'Only the owner can cancel online bookings. Please escalate.',
    );
  }

  // Staff/admin cancellations always get a full refund when applicable —
  // the tiered refund-percent policy only applies to customer self-cancellations
  // (see cancelMyBooking), where it discourages repeated self-service cancels.
  const needsRefund =
    booking.payment_status === 'paid' &&
    booking.payment_method === 'razorpay' &&
    !!booking.razorpay_payment_id;

  if (needsRefund) {
    await refundPayment(booking.razorpay_payment_id!, {
      amount: Math.round(booking.amount * 100), // full refund, in paise
      refundedBy: user.id,
      reason: 'admin_cancelled_full_refund',
    });
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('id', bookingId);

  if (error) throw new Error(error.message);

  return { refunded: needsRefund };
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

export async function markNoShow(bookingId: string) {
  await requireRole(['owner', 'staff']);
  const supabase = await createClient();
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'no_show' }) // no payment_status change — no refund
    .eq('id', bookingId);
  if (error) throw new Error(error.message);
}

export async function markExtensionPaid(
  extensionId: string,
  markedPaidBy: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('session_extensions')
    .update({ payment_status: 'paid', marked_paid_by: markedPaidBy })
    .eq('id', extensionId);
  if (error) throw new Error(error.message);
}

export async function markBookingAndExtensionsPaid(
  bookingId: string,
  method: PaymentMethod,
) {
  await requireRole(['owner', 'staff']);

  const admin = createServiceRoleClient();

  const { error: bookingError } = await admin
    .from('bookings')
    .update({
      payment_status: 'paid',
      payment_method: method,
    })
    .eq('id', bookingId);

  if (bookingError) {
    throw new Error(bookingError.message);
  }

  const { error: extensionsError } = await admin
    .from('session_extensions')
    .update({
      payment_status: 'paid',
    })
    .eq('booking_id', bookingId)
    .eq('payment_status', 'pending');

  if (extensionsError) {
    throw new Error(extensionsError.message);
  }
}
