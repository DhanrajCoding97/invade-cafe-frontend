'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { BadgeCheck, Wallet, Ban, Pencil } from 'lucide-react';
import { type BookingRow } from '@/types';
import ManualBookingForm from '../(dashboard)/dashboard/staff/components/ManualBookingForm';
import {
  useCancelBooking,
  useMarkPaid,
  useMarkRefunded,
} from '@/hooks/use-booking-mutations';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Trash2Icon, WalletIcon } from 'lucide-react';

export function BookingActions({ booking }: { booking: BookingRow }) {
  // console.log(booking);
  const [open, setOpen] = useState(false);
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
      // <Button
      //   onClick={() => {
      //     if (
      //       confirm(
      //         'Refund this booking through Razorpay? This will process the refund immediately.',
      //       )
      //     )
      //       markRefunded.mutate({
      //         paymentId: booking.razorpay_payment_id!,
      //       });
      //   }}
      //   disabled={markRefunded.isPending}
      //   className='text-xs text-orange-600 hover:underline'
      // >
      //   Refund
      // </Button>
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                disabled={markRefunded.isPending}
                className='text-xs text-orange-600 hover:underline'
              >
                {/* Refund */}
                <Wallet className='h-4 w-4' />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>

          <TooltipContent>Issue a refund through Razorpay</TooltipContent>
        </Tooltip>
        <AlertDialogContent size='default'>
          <AlertDialogHeader>
            <AlertDialogMedia className='bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'>
              <WalletIcon />
            </AlertDialogMedia>

            <AlertDialogTitle>Issue Refund?</AlertDialogTitle>

            <AlertDialogDescription>
              This will immediately initiate a refund through Razorpay for this
              booking. Once the refund request is sent, this action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel variant='ghost'>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={markRefunded.isPending}
              onClick={() =>
                markRefunded.mutate({
                  paymentId: booking.razorpay_payment_id!,
                })
              }
            >
              {markRefunded.isPending ? 'Processing...' : 'Issue Refund'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div className='flex gap-2'>
      {booking.payment_status === 'pending' && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() =>
                markPaid.mutate({
                  bookingId: booking.id,
                  method: booking.payment_method ?? 'cash',
                })
              }
              disabled={markPaid.isPending}
              className='text-xs text-green-700 hover:underline'
            >
              {/* Mark paid */}
              <BadgeCheck className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mark this booking as paid</TooltipContent>
        </Tooltip>
      )}
      {/* <button
        onClick={() => {
          if (confirm('Cancel this booking?')) cancelBooking.mutate(booking.id);
        }}
        disabled={cancelBooking.isPending}
        className='text-xs text-red-600 hover:underline'
      >
        Cancel
      </button> */}
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                disabled={cancelBooking.isPending}
                className='text-xs text-orange-600 hover:underline'
              >
                <Ban className='h-4 w-4' />
                {/* Cancel */}
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>

          <TooltipContent>Cancel Booking</TooltipContent>
        </Tooltip>
        <AlertDialogContent size='default'>
          <AlertDialogHeader>
            <AlertDialogMedia className='bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'>
              <Trash2Icon />
            </AlertDialogMedia>

            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently cancel the booking.This action is not
              reverisble
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel variant='ghost'>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={cancelBooking.isPending}
              onClick={() => cancelBooking.mutate(booking.id)}
            >
              {cancelBooking.isPending ? 'Processing...' : 'Cancel booking'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Edit opens a dialog/sheet — separate component */}
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button>
                <Pencil className='h-4 w-4' />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Edit Booking</TooltipContent>
        </Tooltip>
        <DialogContent className='sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6'>
          <ManualBookingForm
            mode='edit'
            bookingId={booking.id}
            isOnlineBooking={booking.payment_method === 'razorpay'}
            defaultValues={{
              customerName:
                booking.profiles?.full_name ?? booking.customer_name ?? '',
              customerPhone:
                booking.profiles?.phone ?? booking.customer_phone ?? '',
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
            onSuccess={() => {
              setOpen(false);
              console.log(booking.station_id);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
