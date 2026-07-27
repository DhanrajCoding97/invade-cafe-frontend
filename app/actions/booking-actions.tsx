// booking-actions.tsx
'use client';
import { type BookingRow } from '@/types';
import {
  useCancelBooking,
  useMarkPaid,
  useMarkRefunded,
} from '@/hooks/use-booking-mutations';

export function BookingActions({ booking }: { booking: BookingRow }) {
  console.log(
    'status:',
    JSON.stringify(booking.status),
    'user_id:',
    booking.user_id,
    'payment_status:',
    booking.payment_status,
  );

  const cancelBooking = useCancelBooking();
  const markPaid = useMarkPaid();
  const markRefunded = useMarkRefunded();

  // Terminal states — nothing actionable except a future refund on completed+paid+online
  if (booking.status === 'cancelled') return null;

  if (booking.status === 'completed') {
    const canRefund = !!booking.user_id && booking.payment_status === 'paid';
    if (!canRefund) return null;

    return (
      <button
        onClick={() => {
          if (
            confirm(
              "Mark this booking as refunded? Make sure you've processed the refund in Razorpay first.",
            )
          )
            markRefunded.mutate(booking.id);
        }}
        disabled={markRefunded.isPending}
        className='text-xs text-orange-600 hover:underline'
      >
        Mark refunded
      </button>
    );
  }

  return (
    <div className='flex gap-2'>
      {booking.payment_status === 'pending' && (
        <button
          onClick={() =>
            markPaid.mutate({
              bookingId: booking.id,
              method: booking.payment_method ?? 'cash',
            })
          }
          disabled={markPaid.isPending}
          className='text-xs text-green-700 hover:underline'
        >
          Mark paid
        </button>
      )}
      <button
        onClick={() => {
          if (confirm('Cancel this booking?')) cancelBooking.mutate(booking.id);
        }}
        disabled={cancelBooking.isPending}
        className='text-xs text-red-600 hover:underline'
      >
        Cancel
      </button>
      {/* Edit opens a dialog/sheet — separate component */}
    </div>
  );
}
