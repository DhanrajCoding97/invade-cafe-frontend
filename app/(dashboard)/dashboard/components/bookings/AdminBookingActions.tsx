'use client';
import Link from 'next/link';
import {
  BadgeCheck,
  Wallet,
  Ban,
  Pencil,
  RotateCcw,
  MoreVertical,
  Eye,
  Trash2Icon,
  WalletIcon,
} from 'lucide-react';
import { type BookingRow } from '@/types';
import { Button } from '@/components/ui/button';
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
  AlertDialogMedia,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useBookingActionState } from '@/hooks/use-booking-action-state';
import ManualBookingForm from '../../staff/components/ManualBookingForm';

type AdminBookingActionsProps = {
  booking?: BookingRow;
};
export default function AdminBookingActions({
  booking,
}: AdminBookingActionsProps) {
  if (!booking || booking.status === 'cancelled') return null;

  const {
    role,
    editOpen,
    setEditOpen,
    cancelBooking,
    markPaid,
    markRefunded,
    canMarkPaid,
    canCancel,
    canEdit,
    canRefund,
  } = useBookingActionState(booking);
  const stubBtn =
    'flex h-14 flex-1 flex-col items-center justify-center gap-1 rounded-md border border-white/10 bg-white/[0.03] text-[10px] font-medium uppercase tracking-wider text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white';

  //editDialog
  const editDialog = canEdit && (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setEditOpen(true)}
          className='group min-h-9 h-11 flex-1 gap-2 rounded-md bg-fuchsia-500 text-sm font-semibold uppercase tracking-wider text-black transition-all duration-200 hover:bg-fuchsia-700 hover:shadow-[0_0_18px_rgba(239,68,68,0.35)] hover:-translate-y-0.5 active:translate-y-0'
        >
          <Pencil className='size-5 transition-all duration-300 ease-in group-hover:text-white' />
          Edit Booking
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-6 sm:max-w-3xl'>
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
          onSuccess={() => setEditOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );

  //   mark payment as paid button
  const markPaidDailog = canMarkPaid && (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={markPaid.isPending}
          className='group min-h-9 h-11 flex-1 gap-2 rounded-md bg-green-500  text-sm font-semibold uppercase tracking-wider text-black transition-all duration-200 hover:bg-green-700 hover:shadow-[0_0_18px_rgba(239,68,68,0.35)] hover:-translate-y-0.5 active:translate-y-0'
        >
          <BadgeCheck className='size-5 transition-all duration-300 ease-in group-hover:text-green-500' />{' '}
          Mark Paid
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size='default'>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm payment received?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark the booking as <strong>Paid</strong>. Ensure you've
            received the payment via cash, UPI, or card before continuing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant='ghost'>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={markPaid.isPending}
            onClick={() =>
              markPaid.mutate({
                bookingId: booking.id,
                method: booking.payment_method ?? 'cash',
              })
            }
          >
            {markPaid.isPending ? 'Processing...' : 'Mark as Paid'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  //cancelBoookingDialog
  const cancelBoookingDialog = canCancel && (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={cancelBooking.isPending}
          className='group min-h-9 h-11 flex-1 gap-2 rounded-md bg-red-800 text-sm font-semibold uppercase tracking-wider text-black transition-all duration-200 hover:bg-red-700 hover:shadow-[0_0_18px_rgba(239,68,68,0.35)] hover:-translate-y-0.5 active:translate-y-0'
        >
          <Ban className='size-5 transition-colors duration-200 group-hover:text-red-300 motion-preset-shake motion-paused group-hover:motion-running' />
          Cancel Booking
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size='default'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-xl'>
            Cancel this booking?
          </AlertDialogTitle>

          <AlertDialogDescription className='text-sm leading-relaxed'>
            This booking will be marked as{' '}
            <strong className='font-semibold text-red-300'>Cancelled</strong>{' '}
            and the time slot will become available for new bookings.
            {booking.payment_method === 'razorpay' && (
              <>
                {' '}
                Any eligible refund will be{' '}
                <strong className='font-semibold text-amber-300'>
                  initiated automatically
                </strong>
                .
              </>
            )}
            <span className='mt-2 block text-white/40'>
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='gap-2 sm:gap-2'>
          <AlertDialogCancel>Keep Booking</AlertDialogCancel>

          <AlertDialogAction
            disabled={cancelBooking.isPending}
            onClick={() => cancelBooking.mutate(booking.id)}
            variant='destructive'
          >
            {cancelBooking.isPending ? 'Cancelling...' : 'Cancel Booking'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const refundBookingDialog = role === 'owner' && canRefund && (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={markRefunded.isPending}
          className='group min-h-9 h-11 flex-1 gap-2 rounded-md bg-amber-500 text-sm font-semibold uppercase tracking-wider text-black  hover:bg-amber-600 hover:shadow-[0_0_18px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-colors duration-200 hover:text-amber-100'
        >
          <Wallet className='size-5 transition-colors duration-200 group-hover:text-amber-100' />
          Issue Refund
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size='default'>
        <AlertDialogHeader>
          <AlertDialogTitle>Issue Refund?</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately initiate a refund through Razorpay. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant='ghost'>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={markRefunded.isPending}
            onClick={() =>
              markRefunded.mutate({ paymentId: booking.razorpay_payment_id! })
            }
          >
            {markRefunded.isPending ? 'Processing...' : 'Issue Refund'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className='w-full flex flex-col sm:flex-row gap-4'>
      {/* view booking button */}
      {markPaidDailog}
      {cancelBoookingDialog}
      {editDialog}
      {refundBookingDialog}
    </div>
  );
}
