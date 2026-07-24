// booking-actions.tsx
'use client';
import { type BookingRow } from '@/types';
import { useCancelBooking, useMarkPaid } from '@/hooks/use-booking-mutations';

export function BookingActions({ booking }: { booking: BookingRow }) {
  const cancelBooking = useCancelBooking();
  const markPaid = useMarkPaid();

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
      {booking.status !== 'cancelled' && (
        <button
          onClick={() => {
            if (confirm('Cancel this booking?'))
              cancelBooking.mutate(booking.id);
          }}
          disabled={cancelBooking.isPending}
          className='text-xs text-red-600 hover:underline'
        >
          Cancel
        </button>
      )}
      {/* Edit opens a dialog/sheet — separate component */}
    </div>
  );
}
