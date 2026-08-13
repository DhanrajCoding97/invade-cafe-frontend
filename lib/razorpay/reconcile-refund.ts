// import Razorpay from 'razorpay';
// import { createServiceRoleClient } from '../supabase/service-role';
// export async function reconcileRefundFromWebhook({
//   razorpay,
//   razorpay_refund_id,
//   razorpay_payment_id,
//   status, // 'processed' | 'failed'
// }: {
//   razorpay: Razorpay;
//   razorpay_refund_id: string;
//   razorpay_payment_id: string;
//   status: 'processed' | 'failed';
// }) {
//   const supabase = await createServiceRoleClient();

//   const { data: booking, error: fetchError } = await supabase
//     .from('bookings')
//     .select(
//       'id, amount, refunded_amount, payment_status, user_id, razorpay_order_id',
//     )
//     .eq('razorpay_payment_id', razorpay_payment_id)
//     .single();

//   if (fetchError || !booking) {
//     console.error('Reconcile refund: no booking found for payment', {
//       razorpay_payment_id,
//       razorpay_refund_id,
//     });
//     return; // nothing to reconcile against — log only, don't throw (would trigger a webhook retry loop)
//   }

//   if (status === 'failed') {
//     await supabase.from('failed_refunds').insert({
//       razorpay_payment_id,
//       razorpay_order_id: booking.razorpay_order_id,
//       user_id: booking.user_id,
//       amount: 0, // unknown from this event alone — flagged for manual lookup
//       reason: 'refund_failed_webhook',
//       notes: { razorpay_refund_id },
//     });
//     return;
//   }

//   // status === 'processed' — fetch the payment from Razorpay directly to get the
//   // authoritative total refunded amount (amount_refunded), rather than incrementing
//   // locally. This makes reconciliation idempotent no matter how many times this
//   // event fires, and stays correct even if refundPayment() already updated this
//   // same booking synchronously before the webhook arrived.
//   const payment = await razorpay.payments.fetch(razorpay_payment_id);
//   const authoritativeRefundedPaise = Number(payment.amount_refunded ?? 0);
//   const amountPaidPaise = booking.amount * 100;
//   const authoritativeRefundedRupees = authoritativeRefundedPaise / 100;
//   const isFullRefund = authoritativeRefundedPaise >= amountPaidPaise;
//   // const finalStatus =
//   //   authoritativeRefundedPaise >= amountPaidPaise
//   //     ? 'refunded'
//   //     : authoritativeRefundedPaise > 0
//   //       ? 'partially_refunded'
//   //       : booking.payment_status; // no change if somehow 0
//   const finalStatus = isFullRefund
//     ? 'refunded'
//     : authoritativeRefundedPaise > 0
//       ? 'partially_refunded'
//       : booking.payment_status; // no change if somehow 0

//   await supabase
//     .from('bookings')
//     .update({
//       payment_status: finalStatus,
//       refunded_amount: authoritativeRefundedPaise,
//     })
//     .eq('id', booking.id);

//   // on-conflict-do-nothing: if refundPayment() already inserted this exact
//   // refund id, this is a safe no-op rather than a duplicate row.
//   await supabase.from('refund_log').upsert(
//     {
//       booking_id: booking.id,
//       razorpay_refund_id,
//       amount: authoritativeRefundedPaise, // best-effort; if you want the delta for THIS refund specifically, use event.payload.refund.entity.amount instead
//       refunded_by: null, // system/webhook-originated, not staff/customer-initiated
//       reason: 'webhook_reconciliation',
//     },
//     { onConflict: 'razorpay_refund_id', ignoreDuplicates: true },
//   );
// }
// lib/razorpay/reconcile-refund.ts
import Razorpay from 'razorpay';
import { createServiceRoleClient } from '../supabase/service-role';

export async function reconcileRefundFromWebhook({
  razorpay,
  razorpay_refund_id,
  razorpay_payment_id,
  status, // 'processed' | 'failed'
}: {
  razorpay: Razorpay;
  razorpay_refund_id: string;
  razorpay_payment_id: string;
  status: 'processed' | 'failed';
}) {
  const supabase = await createServiceRoleClient();

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select(
      'id, amount, refunded_amount, payment_status, status, user_id, razorpay_order_id',
    )
    .eq('razorpay_payment_id', razorpay_payment_id)
    .single();

  if (fetchError || !booking) {
    console.error('Reconcile refund: no booking found for payment', {
      razorpay_payment_id,
      razorpay_refund_id,
    });
    return; // nothing to reconcile against — log only, don't throw (would trigger a webhook retry loop)
  }

  if (status === 'failed') {
    await supabase.from('failed_refunds').insert({
      razorpay_payment_id,
      razorpay_order_id: booking.razorpay_order_id,
      user_id: booking.user_id,
      amount: 0, // unknown from this event alone — flagged for manual lookup
      reason: 'refund_failed_webhook',
      notes: { razorpay_refund_id },
    });
    return;
  }

  // status === 'processed' — fetch the payment from Razorpay directly to get the
  // authoritative total refunded amount (amount_refunded), rather than incrementing
  // locally. This makes reconciliation idempotent no matter how many times this
  // event fires, and stays correct even if refundPayment() already updated this
  // same booking synchronously before the webhook arrived.
  const payment = await razorpay.payments.fetch(razorpay_payment_id);
  const authoritativeRefundedPaise = Number(payment.amount_refunded ?? 0);
  const amountPaidPaise = booking.amount * 100;

  // `amount` / `refunded_amount` are stored in rupees throughout the schema
  // (see the booking insert: amount = order.amount / 100) — keep this
  // column in the same unit or every rupee-based comparison against it
  // downstream (refund %, admin totals, etc.) silently breaks.
  const authoritativeRefundedRupees = authoritativeRefundedPaise / 100;

  const isFullRefund = authoritativeRefundedPaise >= amountPaidPaise;

  const finalStatus = isFullRefund
    ? 'refunded'
    : authoritativeRefundedPaise > 0
      ? 'partially_refunded'
      : booking.payment_status; // no change if somehow 0

  const bookingUpdate: Record<string, unknown> = {
    payment_status: finalStatus,
    refunded_amount: authoritativeRefundedRupees,
  };

  // Safety net: a booking that's fully refunded should never be left
  // sitting in `confirmed` (this is what produced the "refunded but still
  // confirmed" rows — a race between the webhook and verify both handling
  // the same payment). Only auto-cancel on a FULL refund; partial refunds
  // (e.g. a shortened session) intentionally leave the booking active.
  if (isFullRefund && booking.status !== 'cancelled') {
    bookingUpdate.status = 'cancelled';
    bookingUpdate.cancelled_at = new Date().toISOString();
  }

  await supabase.from('bookings').update(bookingUpdate).eq('id', booking.id);

  // on-conflict-do-nothing: if refundPayment() already inserted this exact
  // refund id, this is a safe no-op rather than a duplicate row.
  await supabase.from('refund_log').upsert(
    {
      booking_id: booking.id,
      razorpay_refund_id,
      amount: authoritativeRefundedRupees, // best-effort; if you want the delta for THIS refund specifically, use event.payload.refund.entity.amount / 100 instead
      refunded_by: null, // system/webhook-originated, not staff/customer-initiated
      reason: 'webhook_reconciliation',
    },
    { onConflict: 'razorpay_refund_id', ignoreDuplicates: true },
  );
}
