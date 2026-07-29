// booking-actions.tsx
'use client';
import { useState } from 'react';
import { type BookingRow } from '@/types';
import ManualBookingForm from '../(dashboard)/dashboard/staff/components/ManualBookingForm';
import {
  useCancelBooking,
  useMarkPaid,
  useMarkRefunded,
} from '@/hooks/use-booking-mutations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

export function BookingActions({ booking }: { booking: BookingRow }) {
  const cancelBooking = useCancelBooking();
  const markPaid = useMarkPaid();
  const markRefunded = useMarkRefunded();

  // Terminal states — nothing actionable except a future refund on completed+paid+online
  if (booking.status === 'cancelled') return null;

  if (booking.status === 'completed') {
    const canRefund =
      !!booking.user_id &&
      booking.payment_status === 'paid' &&
      booking.payment_method === 'razorpay' &&
      !!booking.razorpay_payment_id;

    if (!canRefund) return null;

    return (
      <button
        onClick={() => {
          if (
            confirm(
              'Refund this booking through Razorpay? This will process the refund immediately.',
            )
          )
            markRefunded.mutate({
              bookingId: booking.id,
              paymentId: booking.razorpay_payment_id!,
            });
        }}
        disabled={markRefunded.isPending}
        className='text-xs text-orange-600 hover:underline'
      >
        Refund
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
      <Dialog>
        <DialogTrigger asChild>
          <Button>Edit</Button>
        </DialogTrigger>
        <DialogContent className='w-full max-w-lg max-h-[90vh] overflow-y-auto'>
          <ManualBookingForm
            mode='edit'
            bookingId={booking.id}
            defaultValues={{
              customerName: booking.customer_name ?? '',
              customerPhone: booking.customer_phone ?? '',
              device: booking.device,
              stationId: booking.station_id,
              date: new Date(booking.date),
              startTime: booking.start_time,
              duration: booking.duration_hours ?? 1,
              players: booking.players,
              paymentMethod:
                booking.payment_method === 'razorpay' ||
                booking.payment_method === null
                  ? 'cash'
                  : booking.payment_method,
              amountOverride: booking.amount,
              startNow: !!booking.session_started_at,
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
