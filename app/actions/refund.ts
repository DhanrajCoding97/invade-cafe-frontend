import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay =
  keyId && keySecret
    ? new Razorpay({ key_id: keyId, key_secret: keySecret })
    : null;

export async function refundPayment(
  paymentId: string,
  opts: { amount?: number; refundedBy: string; reason?: string },
) {
  if (!razorpay) throw new Error('Missing Razorpay environment variables');

  const supabase = await createClient();

  //fetching paymentstatus,amount,refund_amount from backend to issue correct amount
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select(
      'id, payment_status, amount, refunded_amount, user_id, razorpay_order_id',
    )
    .eq('razorpay_payment_id', paymentId)
    .single();

  if (fetchError || !booking)
    throw new Error('Booking not found for this payment');

  if (booking.payment_status === 'refunded') {
    throw new Error('This booking has already been refunded');
  }

  const alreadyRefunded = booking.refunded_amount ?? 0;
  const amountPaidPaise = booking.amount * 100;
  const refundableRemaining = amountPaidPaise - alreadyRefunded;
  const amount = opts.amount ?? refundableRemaining;
  if (
    amount <= 0 ||
    amount > refundableRemaining ||
    !Number.isInteger(amount)
  ) {
    throw new Error('Invalid refund amount');
  }

  //prevent race condition if admin double clicks the refund button
  const { data: claimed, error: claimError } = await supabase
    .from('bookings')
    .update({ payment_status: 'refund_processing' })
    .eq('id', booking.id)
    .in('payment_status', ['paid', 'partially_refunded'])
    .select('id')
    .single();

  if (claimError || !claimed) {
    throw new Error(
      'Refund already in progress or booking state changed — refresh and retry',
    );
  }
  try {
    const refund = await razorpay.payments.refund(paymentId, { amount });

    const newRefundedTotal = alreadyRefunded + amount;

    const finalStatus =
      newRefundedTotal >= amountPaidPaise ? 'refunded' : 'partially_refunded';

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: finalStatus,
        refunded_amount: newRefundedTotal,
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Refund succeeded but DB update failed:', updateError, {
        bookingId: booking.id,
        paymentId,
      });
      await supabase.from('failed_refunds').insert({
        razorpay_payment_id: paymentId,
        razorpay_order_id: booking.razorpay_order_id,
        user_id: booking.user_id,
        amount,
        reason: 'db_update_failed_after_refund',
        notes: { error: updateError },
      });
    }

    await supabase.from('refund_log').insert({
      booking_id: booking.id,
      razorpay_refund_id: refund.id,
      amount,
      refunded_by: opts.refundedBy,
      reason: opts.reason ?? null,
    });

    return refund;
  } catch (err: any) {
    // Roll the claim back so it can be retried
    await supabase
      .from('bookings')
      .update({ payment_status: booking.payment_status })
      .eq('id', booking.id);

    const description = err?.error?.description;

    if (description === 'The payment has been fully refunded already') {
      await supabase
        .from('bookings')
        .update({
          payment_status: 'refunded',
          refunded_amount: booking.amount * 100,
        })
        .eq('id', booking.id);
      return {
        synced: true,
        note: 'Payment was already refunded; local status corrected.',
      };
    }

    console.error('Razorpay refund error:', JSON.stringify(err, null, 2));
    throw new Error(description ?? err?.message ?? 'Refund failed');
  }
}
