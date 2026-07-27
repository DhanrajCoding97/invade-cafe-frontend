'use server';

import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function cancelMyBooking(bookingId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Read via the session-scoped client — RLS's existing "own bookings select"
  // policy already allows this, no change needed here.
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select(
      'id, user_id, date, start_time, status, payment_status, payment_method, razorpay_payment_id',
    )
    .eq('id', bookingId)
    .single();

  if (fetchError || !booking) throw new Error('Booking not found');
  if (booking.user_id !== user.id) throw new Error('Not your booking');
  if (booking.status === 'cancelled') throw new Error('Already cancelled');

  const sessionStart = new Date(`${booking.date}T${booking.start_time}`);
  const hoursUntilStart = (sessionStart.getTime() - Date.now()) / 3_600_000;

  if (hoursUntilStart < 2) {
    throw new Error(
      'Cancellation window has passed. Contact the cafe to cancel.',
    );
  }

  const shouldRefund =
    booking.payment_status === 'paid' &&
    booking.payment_method === 'razorpay' &&
    !!booking.razorpay_payment_id;

  if (shouldRefund) {
    try {
      await razorpay.payments.refund(booking.razorpay_payment_id!, {});
    } catch (err: any) {
      throw new Error(
        err?.error?.description ?? 'Refund failed — please contact the cafe',
      );
    }
  }

  // Write via the service-role client — bypasses RLS entirely. Safe here
  // because every check above (ownership, window, refund) has already run
  // in trusted server code; this is the only path that can reach this write.
  const admin = createServiceRoleClient();
  const { error } = await admin
    .from('bookings')
    .update({
      status: 'cancelled',
      ...(shouldRefund && { payment_status: 'refunded' }),
    })
    .eq('id', bookingId);

  if (error) throw new Error(error.message);
}
