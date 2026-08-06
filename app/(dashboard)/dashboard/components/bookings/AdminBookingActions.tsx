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
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
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

  // view button
  const viewButton = (
    <Link href={`/dashboard/staff/bookings/${booking.id}`}>
      <Eye size={14} className='mr-2' />
      View booking
    </Link>
  );

  //editDialog
  const editDialog = canEdit && (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogTrigger asChild>
        <Button variant='action' onClick={() => setEditOpen(true)}>
          <Pencil className='size-5 transition-all duration-300 ease-in group-hover:text-blue-300' />
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
        <Button disabled={markPaid.isPending} variant='action'>
          <BadgeCheck className='size-5 transition-all duration-300 ease-in group-hover:text-green-500' />{' '}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size='default'>
        <AlertDialogHeader>
          <AlertDialogMedia className='bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'>
            <Trash2Icon />
          </AlertDialogMedia>
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
        <Button disabled={cancelBooking.isPending} variant='action'>
          <Ban className='size-5 transition-all duration-300 ease-in group-hover:text-[#FF6060]' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size='default'>
        <AlertDialogHeader>
          <AlertDialogMedia className='bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'>
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            This booking will be marked as <strong>Cancelled</strong> and the
            time slot will become available for new bookings and if online the
            refund is automatically initiated. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant='ghost'>Keep Booking</AlertDialogCancel>
          <AlertDialogAction
            disabled={cancelBooking.isPending}
            onClick={() => cancelBooking.mutate(booking.id)}
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
        <Button disabled={markRefunded.isPending} variant='action'>
          <Wallet className='size-5 transition-all duration-300 ease-in group-hover:text-green-600' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size='default'>
        <AlertDialogHeader>
          <AlertDialogMedia className='bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'>
            <WalletIcon />
          </AlertDialogMedia>
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
    <div className='flex gap-4'>
      {/* view booking button */}
      {viewButton}
      {markPaidDailog}
      {cancelBoookingDialog}
      {editDialog}
      {refundBookingDialog}
    </div>
  );
}
