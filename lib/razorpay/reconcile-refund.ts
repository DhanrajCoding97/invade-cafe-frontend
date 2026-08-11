import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';

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
  const supabase = await createClient();

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select(
      'id, amount, refunded_amount, payment_status, user_id, razorpay_order_id',
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

  const finalStatus =
    authoritativeRefundedPaise >= amountPaidPaise
      ? 'refunded'
      : authoritativeRefundedPaise > 0
        ? 'partially_refunded'
        : booking.payment_status; // no change if somehow 0

  await supabase
    .from('bookings')
    .update({
      payment_status: finalStatus,
      refunded_amount: authoritativeRefundedPaise,
    })
    .eq('id', booking.id);

  // on-conflict-do-nothing: if refundPayment() already inserted this exact
  // refund id, this is a safe no-op rather than a duplicate row.
  await supabase.from('refund_log').upsert(
    {
      booking_id: booking.id,
      razorpay_refund_id,
      amount: authoritativeRefundedPaise, // best-effort; if you want the delta for THIS refund specifically, use event.payload.refund.entity.amount instead
      refunded_by: null, // system/webhook-originated, not staff/customer-initiated
      reason: 'webhook_reconciliation',
    },
    { onConflict: 'razorpay_refund_id', ignoreDuplicates: true },
  );
}
