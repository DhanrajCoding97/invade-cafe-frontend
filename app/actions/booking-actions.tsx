'use client';
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
import {
  BadgeCheck,
  Wallet,
  Ban,
  Pencil,
  RotateCcw,
  MoreVertical,
} from 'lucide-react';
import { type BookingRow } from '@/types';
import ManualBookingForm from '../(dashboard)/dashboard/staff/components/ManualBookingForm';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trash2Icon, WalletIcon } from 'lucide-react';
import { useBookingActionState } from '@/hooks/use-booking-action-state';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
export function BookingActions({
  booking,
  layout = 'row',
}: {
  booking: BookingRow;
  layout?: 'row' | 'compact';
}) {
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
  if (booking.status === 'cancelled') return null;

  const markPaidBtn = canMarkPaid && (
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
          variant={layout === 'compact' ? 'outline' : 'action'}
          className={layout === 'compact' ? 'flex-1' : undefined}
        >
          <BadgeCheck className='size-5 transition-all duration-300 ease-in group-hover:text-green-500' />
          {layout === 'compact' && <span className='ml-1.5'>Mark Paid</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Mark this booking as paid</TooltipContent>
    </Tooltip>
  );

  const editDialog = canEdit && (
    <>
      {layout === 'compact' ? (
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setTimeout(() => setEditOpen(true), 0);
          }}
        >
          <Pencil size={14} className='mr-2' /> Edit
        </DropdownMenuItem>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='action' onClick={() => setEditOpen(true)}>
              <Pencil className='size-5 transition-all duration-300 ease-in group-hover:text-blue-300' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit Booking</TooltipContent>
        </Tooltip>
      )}

      {/* Single source of truth — controlled by editOpen state, no trigger needed */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
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
    </>
  );

  const cancelDialog = canCancel && (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            {layout === 'compact' ? (
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className='text-red-400 min-w-fit'
                asChild
              >
                <button className='flex w-full items-center min-w-fit'>
                  <Ban size={14} className='mr-2' /> Cancel booking
                </button>
              </DropdownMenuItem>
            ) : (
              <Button disabled={cancelBooking.isPending} variant='action'>
                <Ban className='size-5 transition-all duration-300 ease-in group-hover:text-[#FF6060]' />
              </Button>
            )}
          </AlertDialogTrigger>
        </TooltipTrigger>
        {layout === 'row' && <TooltipContent>Cancel Booking</TooltipContent>}
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
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            {layout === 'compact' ? (
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
                <button className='flex w-full items-center'>
                  <RotateCcw size={14} className='mr-2' /> Issue refund
                </button>
              </DropdownMenuItem>
            ) : (
              <Button disabled={markRefunded.isPending} variant='action'>
                <Wallet className='size-5 transition-all duration-300 ease-in group-hover:text-green-600' />
              </Button>
            )}
          </AlertDialogTrigger>
        </TooltipTrigger>
        {layout === 'row' && (
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

  if (layout === 'row') {
    return (
      <div className='flex gap-2'>
        {markPaidBtn}
        {cancelDialog}
        {editDialog}
        {refundDialog}
      </div>
    );
  }

  // compact: Mark Paid stays primary, rest go in overflow
  const hasOverflowItems =
    canEdit || canCancel || (role === 'owner' && canRefund);

  return (
    <div className='flex gap-2'>
      {markPaidBtn}
      {hasOverflowItems && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon' aria-label='More actions'>
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {editDialog}
            {cancelDialog}
            {refundDialog}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
