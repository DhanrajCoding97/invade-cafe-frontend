'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useCancelMyBooking } from '@/hooks/use-customer-booking';
import { useRefundPercent } from '@/hooks/use-refund-percent';
import { Button } from '@/components/ui/button';
import { type BookingRow } from '@/types';

function hoursUntil(booking: BookingRow) {
  const start = new Date(`${booking.date}T${booking.start_time}`);
  return (start.getTime() - Date.now()) / 3_600_000;
}

export function CancelBookingButton({ booking }: { booking: BookingRow }) {
  const cancelMutation = useCancelMyBooking();
  const { data: refundData } = useRefundPercent();

  const canCancel = booking.status === 'confirmed' && hoursUntil(booking) >= 2;
  if (!canCancel) return null;

  const refundPercent = refundData?.refundPercent ?? 100;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>Cancel Booking</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel booking?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently cancel your booking. You will receive a{' '}
            <strong>{refundPercent}% refund</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Keep Booking</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => cancelMutation.mutate(booking.id)}
            variant='destructive'
          >
            Cancel Booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
