'use server';

import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth/requrireRole';
import { PaymentMethod, PaymentStatus } from '@/types';
import { refundPayment } from './refund';
import { getRefundPercentForCount } from '@/lib/cancellation-policy';

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

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: monthCount, error: monthErr } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', booking.user_id)
    .eq('status', 'cancelled')
    .gte('cancelled_at', startOfMonth.toISOString());
  if (monthErr) throw new Error(monthErr.message);

  const refundPercent = getRefundPercentForCount(monthCount ?? 0);

  const needsRefund =
    booking.payment_status === 'paid' &&
    booking.payment_method === 'razorpay' &&
    !!booking.razorpay_payment_id;

  if (needsRefund) {
    const refundAmountPaise = Math.round(
      (booking.amount * 100 * refundPercent) / 100,
    );
    await refundPayment(booking.razorpay_payment_id!, {
      amount: refundAmountPaise,
      refundedBy: user.id,
      reason: `admin_cancelled_${refundPercent}pct`,
    });
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('id', bookingId);

  if (error) throw new Error(error.message);

  return { refundPercent };
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
