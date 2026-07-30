import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay =
  keyId && keySecret
    ? new Razorpay({ key_id: keyId, key_secret: keySecret })
    : null;

export async function refundPayment(paymentId: string, amount?: number) {
  if (!razorpay) {
    throw new Error('Missing Razorpay environment variables');
  }

  const supabase = await createClient();

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('id, payment_status')
    .eq('razorpay_payment_id', paymentId)
    .single();

  if (fetchError || !booking) {
    throw new Error('Booking not found for this payment');
  }

  if (booking.payment_status === 'refunded') {
    throw new Error('This booking has already been refunded');
  }

  try {
    const refund = await razorpay.payments.refund(
      paymentId,
      amount ? { amount } : {},
    );

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ payment_status: 'refunded' })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Refund succeeded but DB update failed:', updateError, {
        bookingId: booking.id,
        paymentId,
      });
    }

    return refund;
  } catch (err: any) {
    const description = err?.error?.description;

    // Razorpay says it's already refunded — our DB just didn't know yet.
    // Sync it rather than surfacing this as a failure to the user.
    if (description === 'The payment has been fully refunded already') {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ payment_status: 'refunded' })
        .eq('id', booking.id);

      if (updateError) {
        console.error('Sync-only update failed:', updateError, {
          bookingId: booking.id,
          paymentId,
        });
      }

      return {
        synced: true,
        note: 'Payment was already refunded; local status corrected.',
      };
    }

    console.error('Razorpay refund error:', JSON.stringify(err, null, 2));
    throw new Error(description ?? err?.message ?? 'Refund failed');
  }
}
