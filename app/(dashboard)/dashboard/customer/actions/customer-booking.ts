'use server';

import { refundPayment } from '@/app/actions/refund';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { getRefundPercentForCount } from '@/lib/cancellation-policy';

export async function getRefundPercent() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Unauthorized');

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'cancelled')
    .gte('cancelled_at', startOfMonth.toISOString());

  if (error) throw new Error(error.message);

  return { refundPercent: getRefundPercentForCount(count ?? 0) };
}

type CancelResult =
  | { success: true; refundPercent: number }
  | { success: false; message: string };

export async function cancelMyBooking(
  bookingId: string,
): Promise<CancelResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Not authenticated' };

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select(
      'id, user_id, date, start_time, status, payment_status, payment_method, razorpay_payment_id, amount',
    )
    .eq('id', bookingId)
    .single();

  if (fetchError || !booking)
    return { success: false, message: 'Booking not found' };
  if (booking.user_id !== user.id)
    return { success: false, message: 'Not your booking' };
  if (booking.status === 'cancelled')
    return { success: false, message: 'Already cancelled' };

  const sessionStart = new Date(`${booking.date}T${booking.start_time}`);
  const hoursUntilStart = (sessionStart.getTime() - Date.now()) / 3_600_000;
  if (hoursUntilStart < 2) {
    return {
      success: false,
      message: 'Cancellation window has passed. Contact the cafe to cancel.',
    };
  }

  const admin = createServiceRoleClient();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: todayCount, error: todayErr } = await admin
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'cancelled')
    .gte('cancelled_at', startOfDay.toISOString());
  if (todayErr) return { success: false, message: todayErr.message };
  if ((todayCount ?? 0) >= 1) {
    return {
      success: false,
      message:
        'Only one cancellation allowed per day. Contact the cafe for further help.',
    };
  }

  const { count: monthCount, error: monthErr } = await admin
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'cancelled')
    .gte('cancelled_at', startOfMonth.toISOString());
  if (monthErr) return { success: false, message: monthErr.message };

  const refundPercent = getRefundPercentForCount(monthCount ?? 0);

  const shouldRefund =
    booking.payment_status === 'paid' &&
    booking.payment_method === 'razorpay' &&
    !!booking.razorpay_payment_id;

  if (shouldRefund) {
    const refundAmountPaise = Math.round(
      (booking.amount * 100 * refundPercent) / 100,
    );
    await refundPayment(booking.razorpay_payment_id!, {
      amount: refundAmountPaise,
      refundedBy: user.id,
      reason: `customer_self_cancel_${refundPercent}pct`,
    });
  }

  const { data: cancelled, error } = await admin
    .from('bookings')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    // payment_status is already updated inside refundPayment — don't set it here too
    .eq('id', bookingId)
    .select('id')
    .single();

  if (error || !cancelled) {
    console.error('Cancel status update failed:', error);
    return {
      success: false,
      message:
        'Refund processed, but updating booking status failed. Contact the cafe.',
    };
  }

  return { success: true, refundPercent };
}
