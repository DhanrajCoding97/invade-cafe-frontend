'use client';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { BadgeCheck, Wallet, Ban, Pencil, RotateCcw, Eye } from 'lucide-react';
import { type BookingRow } from '@/types';
import ManualBookingForm from '../(dashboard)/dashboard/staff/components/ManualBookingForm';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Trash2Icon, WalletIcon } from 'lucide-react';
import { useBookingActionState } from '@/hooks/use-booking-action-state';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';

export function BookingActions({
  booking,
  layout = 'row',
  role,
  user,
}: {
  booking: BookingRow;
  layout?: 'row' | 'compact';
  role: 'owner' | 'staff' | undefined;
  user: User;
}) {
  const {
    editOpen,
    setEditOpen,
    cancelBooking,
    markPaid,
    markRefunded,
    markExtensionPaid,
    markBookingAndExtensionsPaid,
    canMarkBookingAndExtensionsPaid,
    canMarkExtensionPaid,
    canMarkPaid,
    canCancel,
    canEdit,
    canRefund,
    hasPendingExtension,
  } = useBookingActionState(booking, role);

  const [paymentMethod, setPaymentMethod] = useState<
    'cash' | 'upi_manual' | 'complimentary'
  >(
    booking.payment_method === 'upi_manual'
      ? 'upi_manual'
      : booking.payment_method === 'complimentary'
        ? 'complimentary'
        : 'cash',
  );

  if (booking.status === 'cancelled') return null;

  const isCompact = layout === 'compact';

  // shared classes for the compact "receipt stub" buttons
  const stubBtn =
    'flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-md border border-white/10 bg-white/[0.03] text-[10px] font-medium uppercase tracking-wider text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white';

  const viewButton = isCompact ? (
    <Link
      aria-label='View this booking'
      key='view'
      href={`/dashboard/staff/bookings/${booking.id}`}
      className={stubBtn}
    >
      <Eye aria-hidden='true' className='size-4' />
      View
    </Link>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='action' asChild>
          <Link
            aria-label='View this booking'
            href={`/dashboard/staff/bookings/${booking.id}`}
          >
            <Eye
              aria-hidden='true'
              className='size-5 transition-all duration-300 ease-in group-hover:text-cyan-300'
            />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>View Booking</TooltipContent>
    </Tooltip>
  );

  const markPaidBtn =
    canMarkPaid &&
    !hasPendingExtension &&
    (isCompact ? (
      <Button
        key='paid'
        onClick={() =>
          markPaid.mutate({
            bookingId: booking.id,
            method: booking.payment_method ?? 'cash',
          })
        }
        disabled={markPaid.isPending}
        className='h-11 w-full gap-2 rounded-md bg-cyan-500 text-sm font-semibold uppercase tracking-wider text-black hover:bg-cyan-400'
      >
        <BadgeCheck aria-hidden='true' className='size-4' />
        {markPaid.isPending ? 'Processing...' : 'Mark Paid'}
      </Button>
    ) : (
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
            variant='action'
            aria-label='Mark booking Paid'
          >
            <BadgeCheck
              aria-hidden='true'
              className='size-5 transition-all duration-300 ease-in group-hover:text-green-500'
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Mark this booking as paid</TooltipContent>
      </Tooltip>
    ));

  const markExtensionPaidBtn = canMarkExtensionPaid && (
    <AlertDialog key='ext-paid'>
      <AlertDialogTrigger asChild>
        {isCompact ? (
          <Button
            disabled={markExtensionPaid.isPending}
            aria-label='Mark extension paid'
            className={cn(stubBtn, 'text-green-500 hover:text-green-400')}
          >
            <BadgeCheck aria-hidden='true' className='size-4' />
            <span className='whitespace-normal text-center text-[10px] leading-tight'>
              Extension Paid
            </span>
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={markExtensionPaid.isPending}
                  variant='action'
                  aria-label='Mark extension paid'
                >
                  <BadgeCheck
                    aria-hidden='true'
                    className='size-5 transition-all duration-300 ease-in group-hover:text-green-500'
                  />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Mark pending extension as paid</TooltipContent>
          </Tooltip>
        )}
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

  const markBookingAndExtensionsPaidBtn = canMarkBookingAndExtensionsPaid && (
    <AlertDialog key='all-paid'>
      <AlertDialogTrigger asChild>
        {isCompact ? (
          <Button
            disabled={markBookingAndExtensionsPaid.isPending}
            aria-label='Mark booking and extensions paid'
            className={cn(stubBtn, 'text-green-500 hover:text-green-400')}
          >
            <BadgeCheck aria-hidden='true' className='size-4' />
            <span className='whitespace-normal text-center text-[10px] leading-tight'>
              All Paid
            </span>
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={markBookingAndExtensionsPaid.isPending}
                  variant='action'
                  aria-label='Mark booking and extensions paid'
                >
                  <BadgeCheck
                    aria-hidden='true'
                    className='size-5 transition-all duration-300 ease-in group-hover:text-green-500'
                  />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Mark booking and extensions as paid</TooltipContent>
          </Tooltip>
        )}
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
              setPaymentMethod(value as 'cash' | 'upi_manual' | 'complimentary')
            }
            disabled={markBookingAndExtensionsPaid.isPending}
          >
            <SelectTrigger className='h-11 w-full border-cyan-500/30 bg-white/3 font-mono text-sm text-white'>
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
  const editButton =
    canEdit &&
    (isCompact ? (
      <button
        aria-label='Open Edit Dialog'
        key='edit'
        className={stubBtn}
        onClick={() => setEditOpen(true)}
      >
        <Pencil aria-hidden='true' className='size-4' />
        Edit
      </button>
    ) : (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label='Open Edit Dialog'
            variant='action'
            onClick={() => setEditOpen(true)}
          >
            <Pencil
              aria-hidden='true'
              className='size-5 transition-all duration-300 ease-in group-hover:text-blue-300'
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit Booking</TooltipContent>
      </Tooltip>
    ));

  // dialog lives outside the layout branches so it's always mounted once
  const editDialog = canEdit && (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-6 sm:max-w-3xl '>
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
            amountOverride: booking.amount_override ?? undefined,
            startNow: !!booking.session_started_at,
          }}
          onSuccess={() => setEditOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );

  const cancelDialog = canCancel && (
    <AlertDialog key='cancel'>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            {isCompact ? (
              <button
                className={`${stubBtn} text-[#FF6060]/70 hover:bg-[#FF6060]/10 hover:text-[#FF6060]`}
              >
                <Ban aria-hidden='true' className='size-4' />
                Cancel
              </button>
            ) : (
              <Button
                aria-label='Open Cancel Booking Dialog'
                disabled={cancelBooking.isPending}
                variant='action'
              >
                <Ban
                  aria-hidden='true'
                  className='size-5 transition-all duration-300 ease-in group-hover:text-[#FF6060]'
                />
              </Button>
            )}
          </AlertDialogTrigger>
        </TooltipTrigger>
        {!isCompact && <TooltipContent>Cancel Booking</TooltipContent>}
      </Tooltip>

      <AlertDialogContent size='default'>
        <AlertDialogHeader>
          <AlertDialogMedia className='bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'>
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently cancel the booking. This action cannot be
            undone.
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
  );

  const refundDialog = role === 'owner' && canRefund && (
    <AlertDialog key='refund'>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            {isCompact ? (
              <Button aria-label='Open Refund Dialog' className={stubBtn}>
                <RotateCcw aria-hidden='true' className='size-4' />
                Refund
              </Button>
            ) : (
              <Button
                aria-label='Open Refund Dialog'
                disabled={markRefunded.isPending}
                variant='action'
              >
                <Wallet
                  aria-hidden='true'
                  className='size-5 transition-all duration-300 ease-in group-hover:text-green-600'
                />
              </Button>
            )}
          </AlertDialogTrigger>
        </TooltipTrigger>
        {!isCompact && (
          <TooltipContent>Issue a refund through Razorpay</TooltipContent>
        )}
      </Tooltip>

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

  if (!isCompact) {
    return (
      <div className='flex gap-2'>
        {viewButton}
        {markPaidBtn}
        {markExtensionPaidBtn}
        {markBookingAndExtensionsPaidBtn}
        {cancelDialog}
        {editDialog}
        {refundDialog}
        {editButton}
      </div>
    );
  }

  // compact / mobile: everything inline, no dropdown
  const stubs = [
    viewButton,
    markExtensionPaidBtn,
    markBookingAndExtensionsPaidBtn,
    editButton,
    refundDialog,
    cancelDialog,
  ].filter(Boolean);

  return (
    <div className='flex flex-col gap-2'>
      {markPaidBtn}
      {stubs.length > 0 && (
        <div className='grid grid-cols-4 gap-2 max-[380px]:grid-cols-2'>
          {stubs}
        </div>
      )}
      {editDialog}
    </div>
  );
}
