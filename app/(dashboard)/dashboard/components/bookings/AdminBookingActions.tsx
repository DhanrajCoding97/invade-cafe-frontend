'use client';
import { useRouter } from 'next/navigation';
import { BadgeCheck, Wallet, Ban, Pencil } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useBookingActionState } from '@/hooks/use-booking-action-state';
import ManualBookingForm from '../../staff/components/ManualBookingForm';
import { useState } from 'react';
import { markBookingAndExtensionsPaid } from '@/app/actions/bookings';
import { type User } from '@supabase/supabase-js';
type AdminBookingActionsProps = {
  booking?: BookingRow;
  user: User;
  role: 'owner' | 'staff' | undefined;
};
export default function AdminBookingActions({
  booking,
  user,
  role,
}: AdminBookingActionsProps) {
  if (!booking || booking.status === 'cancelled') return null;
  const router = useRouter();
  const {
    editOpen,
    setEditOpen,
    cancelBooking,
    markPaid,
    markRefunded,
    markExtensionPaid,
    markBookingAndExtensionsPaid,
    canMarkPaid,
    canMarkBookingAndExtensionsPaid,
    canMarkExtensionPaid,
    canCancel,
    canEdit,
    canRefund,
    hasPendingExtension,
  } = useBookingActionState(booking, role, {
    onMutationSuccess: () => router.refresh(),
  });
  const [paymentMethod, setPaymentMethod] = useState<
    'cash' | 'upi_manual' | 'complimentary'
  >(
    booking.payment_method === 'upi_manual'
      ? 'upi_manual'
      : booking.payment_method === 'complimentary'
        ? 'complimentary'
        : 'cash',
  );
  const extensions = booking.session_extensions ?? [];

  const isOnlineBooking = booking.payment_method === 'razorpay';

  const needsBookingPayment =
    booking.payment_status === 'pending' && !isOnlineBooking;

  const needsExtensionPayment = hasPendingExtension;

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
          <Pencil
            aria-hidden='true'
            className='size-5 transition-all duration-300 ease-in group-hover:text-white'
          />
          Edit Booking
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-0 sm:max-w-3xl'>
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
  const markPaidDialog = canMarkPaid && !hasPendingExtension && (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={markPaid.isPending}
          className='group min-h-9 h-11 flex-1 gap-2 rounded-md bg-green-500  text-sm font-semibold uppercase tracking-wider text-black transition-all duration-200 hover:bg-green-700 hover:shadow-[0_0_18px_rgba(239,68,68,0.35)] hover:-translate-y-0.5 active:translate-y-0'
        >
          <BadgeCheck
            aria-hidden='true'
            className='size-5 transition-all duration-300 ease-in group-hover:text-green-500'
          />
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

  //bookings/[id]/page.tsx
  //for online booking sesion extension payment
  const markExtensionPaidDialog = canMarkExtensionPaid && (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={markExtensionPaid.isPending}
          className='group min-h-9 h-11 flex-1 gap-2 rounded-md bg-green-500 text-sm font-semibold uppercase tracking-wider text-black transition-all duration-200 hover:bg-green-700 hover:-translate-y-0.5 active:translate-y-0'
        >
          <BadgeCheck aria-hidden='true' className='size-5' />
          Mark Extension Paid
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size='default'>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirm extension payment received?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This booking has a pending session extension charge. Confirm payment
            was collected at the counter.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant='ghost'>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={markExtensionPaid.isPending}
            onClick={() => {
              const pendingExt = (booking.session_extensions ?? []).find(
                (e: any) => e.payment_status === 'pending',
              );
              if (pendingExt) {
                markExtensionPaid.mutate({
                  extensionId: pendingExt.id,
                  markedPaidBy: user.id,
                });
              }
            }}
          >
            {markExtensionPaid.isPending
              ? 'Processing...'
              : 'Mark Extension Paid'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  //for offline booking with session extension
  const markBookingAndExtensionsPaidDialog =
    canMarkBookingAndExtensionsPaid && (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={markBookingAndExtensionsPaid.isPending}
            className='group min-h-9 h-11 flex-1 gap-2 rounded-md bg-green-500 text-sm font-semibold uppercase tracking-wider text-black transition-all duration-200 hover:bg-green-700 hover:-translate-y-0.5 active:translate-y-0'
          >
            <BadgeCheck aria-hidden='true' className='size-5' />
            Mark All Paid
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent size='default'>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm payment received?</AlertDialogTitle>

            <AlertDialogDescription>
              This booking has one or more unpaid session extensions. Select the
              payment method actually received from the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className='space-y-2 py-2'>
            <label className='text-xs font-mono uppercase tracking-wider text-white/60'>
              Payment Method
            </label>

            <Select
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(
                  value as 'cash' | 'upi_manual' | 'complimentary',
                )
              }
              disabled={markBookingAndExtensionsPaid.isPending}
            >
              <SelectTrigger className='h-11 w-full border-cyan-500/30 bg-white/[0.03] font-mono text-sm text-white'>
                <SelectValue placeholder='Select payment method' />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value='cash'>Cash</SelectItem>
                <SelectItem value='upi_manual'>UPI</SelectItem>
                <SelectItem value='complimentary'>Complimentary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === 'complimentary' && (
            <div className='rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2'>
              <p className='text-xs leading-relaxed text-amber-300'>
                This will mark the booking and all pending extensions as paid
                without collecting payment from the customer.
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel variant='ghost'>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={markBookingAndExtensionsPaid.isPending}
              onClick={() =>
                markBookingAndExtensionsPaid.mutate({
                  bookingId: booking.id,
                  method: paymentMethod,
                })
              }
            >
              {markBookingAndExtensionsPaid.isPending
                ? 'Processing...'
                : 'Mark All as Paid'}
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
          <Ban
            aria-hidden='true'
            className='size-5 transition-colors duration-200 group-hover:text-red-300 motion-preset-shake motion-paused group-hover:motion-running'
          />
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
          <Wallet
            aria-hidden='true'
            className='size-5 transition-colors duration-200 group-hover:text-amber-100'
          />
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
      {markPaidDialog}
      {markExtensionPaidDialog}
      {markBookingAndExtensionsPaidDialog}
      {cancelBoookingDialog}
      {editDialog}
      {refundBookingDialog}
    </div>
  );
}
