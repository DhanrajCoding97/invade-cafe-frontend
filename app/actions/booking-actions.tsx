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
  Eye,
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
import Link from 'next/link';
// export function BookingActions({
//   booking,
//   layout = 'row',
// }: {
//   booking: BookingRow;
//   layout?: 'row' | 'compact';
// }) {
//   const {
//     role,
//     editOpen,
//     setEditOpen,
//     cancelBooking,
//     markPaid,
//     markRefunded,
//     canMarkPaid,
//     canCancel,
//     canEdit,
//     canRefund,
//   } = useBookingActionState(booking);
//   if (booking.status === 'cancelled') return null;

//   const viewButton =
//     layout === 'compact' ? (
//       <DropdownMenuItem asChild>
//         <Link href={`/dashboard/staff/bookings/${booking.id}`}>
//           <Eye size={14} className='mr-2' />
//           View booking
//         </Link>
//       </DropdownMenuItem>
//     ) : (
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <Button variant='action' asChild>
//             <Link href={`/dashboard/staff/bookings/${booking.id}`}>
//               <Eye className='size-5 transition-all duration-300 ease-in group-hover:text-cyan-300' />
//             </Link>
//           </Button>
//         </TooltipTrigger>
//         <TooltipContent>View Booking</TooltipContent>
//       </Tooltip>
//     );

//   const markPaidBtn = canMarkPaid && (
//     <Tooltip>
//       <TooltipTrigger asChild>
//         <Button
//           onClick={() =>
//             markPaid.mutate({
//               bookingId: booking.id,
//               method: booking.payment_method ?? 'cash',
//             })
//           }
//           disabled={markPaid.isPending}
//           variant={layout === 'compact' ? 'outline' : 'action'}
//           className={layout === 'compact' ? 'flex-1' : undefined}
//         >
//           <BadgeCheck className='size-5 transition-all duration-300 ease-in group-hover:text-green-500' />
//           {layout === 'compact' && <span className='ml-1.5'>Mark Paid</span>}
//         </Button>
//       </TooltipTrigger>
//       <TooltipContent>Mark this booking as paid</TooltipContent>
//     </Tooltip>
//   );

//   const editDialog = canEdit && (
//     <>
//       {layout === 'compact' ? (
//         <DropdownMenuItem
//           onSelect={(e) => {
//             e.preventDefault();
//             setTimeout(() => setEditOpen(true), 0);
//           }}
//         >
//           <Pencil size={14} className='mr-2' /> Edit
//         </DropdownMenuItem>
//       ) : (
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button variant='action' onClick={() => setEditOpen(true)}>
//               <Pencil className='size-5 transition-all duration-300 ease-in group-hover:text-blue-300' />
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Edit Booking</TooltipContent>
//         </Tooltip>
//       )}

//       {/* Single source of truth — controlled by editOpen state, no trigger needed */}
//       <Dialog open={editOpen} onOpenChange={setEditOpen}>
//         <DialogContent className='max-h-[90vh] overflow-y-auto p-6 sm:max-w-3xl'>
//           <ManualBookingForm
//             mode='edit'
//             bookingId={booking.id}
//             isOnlineBooking={booking.payment_method === 'razorpay'}
//             defaultValues={{
//               customerName:
//                 booking.profiles?.full_name ?? booking.customer_name ?? '',
//               customerPhone:
//                 booking.profiles?.phone ?? booking.customer_phone ?? '',
//               device: booking.device,
//               stationId: booking.station_id,
//               date: new Date(booking.date),
//               startTime: booking.start_time,
//               duration: booking.duration_hours ?? 1,
//               players: booking.players,
//               paymentMethod:
//                 booking.payment_method === 'razorpay' ||
//                 booking.payment_method === null
//                   ? 'cash'
//                   : booking.payment_method,
//               amountOverride: booking.amount,
//               startNow: !!booking.session_started_at,
//             }}
//             onSuccess={() => setEditOpen(false)}
//           />
//         </DialogContent>
//       </Dialog>
//     </>
//   );

//   const cancelDialog = canCancel && (
//     <AlertDialog>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <AlertDialogTrigger asChild>
//             {layout === 'compact' ? (
//               <DropdownMenuItem
//                 onSelect={(e) => e.preventDefault()}
//                 className='text-red-400 min-w-fit'
//                 asChild
//               >
//                 <button className='flex w-full items-center min-w-fit'>
//                   <Ban size={14} className='mr-2' /> Cancel booking
//                 </button>
//               </DropdownMenuItem>
//             ) : (
//               <Button disabled={cancelBooking.isPending} variant='action'>
//                 <Ban className='size-5 transition-all duration-300 ease-in group-hover:text-[#FF6060]' />
//               </Button>
//             )}
//           </AlertDialogTrigger>
//         </TooltipTrigger>
//         {layout === 'row' && <TooltipContent>Cancel Booking</TooltipContent>}
//       </Tooltip>

//       <AlertDialogContent size='default'>
//         <AlertDialogHeader>
//           <AlertDialogMedia className='bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'>
//             <Trash2Icon />
//           </AlertDialogMedia>
//           <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This will permanently cancel the booking. This action cannot be
//             undone.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel variant='ghost'>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             disabled={cancelBooking.isPending}
//             onClick={() => cancelBooking.mutate(booking.id)}
//           >
//             {cancelBooking.isPending ? 'Processing...' : 'Cancel booking'}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );

//   const refundDialog = role === 'owner' && canRefund && (
//     <AlertDialog>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <AlertDialogTrigger asChild>
//             {layout === 'compact' ? (
//               <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
//                 <button className='flex w-full items-center'>
//                   <RotateCcw size={14} className='mr-2' /> Issue refund
//                 </button>
//               </DropdownMenuItem>
//             ) : (
//               <Button disabled={markRefunded.isPending} variant='action'>
//                 <Wallet className='size-5 transition-all duration-300 ease-in group-hover:text-green-600' />
//               </Button>
//             )}
//           </AlertDialogTrigger>
//         </TooltipTrigger>
//         {layout === 'row' && (
//           <TooltipContent>Issue a refund through Razorpay</TooltipContent>
//         )}
//       </Tooltip>

//       <AlertDialogContent size='default'>
//         <AlertDialogHeader>
//           <AlertDialogMedia className='bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'>
//             <WalletIcon />
//           </AlertDialogMedia>
//           <AlertDialogTitle>Issue Refund?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This will immediately initiate a refund through Razorpay. This
//             action cannot be undone.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel variant='ghost'>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             disabled={markRefunded.isPending}
//             onClick={() =>
//               markRefunded.mutate({ paymentId: booking.razorpay_payment_id! })
//             }
//           >
//             {markRefunded.isPending ? 'Processing...' : 'Issue Refund'}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );

//   if (layout === 'row') {
//     return (
//       <div className='flex gap-2'>
//         {viewButton}
//         {markPaidBtn}
//         {cancelDialog}
//         {editDialog}
//         {refundDialog}
//       </div>
//     );
//   }

//   // compact: Mark Paid stays primary, rest go in overflow
//   const hasOverflowItems =
//     true || canEdit || canCancel || (role === 'owner' && canRefund);

//   return (
//     <div className='flex gap-2'>
//       {markPaidBtn}
//       {hasOverflowItems && (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant='outline' size='icon' aria-label='More actions'>
//               <MoreVertical size={18} />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             {viewButton}
//             {editDialog}
//             {cancelDialog}
//             {refundDialog}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )}
//     </div>
//   );
// }
export function BookingActions({
  booking,
  layout = 'row',
  role,
}: {
  booking: BookingRow;
  layout?: 'row' | 'compact';
  role: 'owner' | 'staff' | undefined;
}) {
  const {
    editOpen,
    setEditOpen,
    cancelBooking,
    markPaid,
    markRefunded,
    canMarkPaid,
    canCancel,
    canEdit,
    canRefund,
  } = useBookingActionState(booking, role);

  if (booking.status === 'cancelled') return null;

  const isCompact = layout === 'compact';

  // shared classes for the compact "receipt stub" buttons
  const stubBtn =
    'flex h-14 flex-1 flex-col items-center justify-center gap-1 rounded-md border border-white/10 bg-white/[0.03] text-[10px] font-medium uppercase tracking-wider text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white';

  const viewButton = isCompact ? (
    <Link
      key='view'
      href={`/dashboard/staff/bookings/${booking.id}`}
      className={stubBtn}
    >
      <Eye className='size-4' />
      View
    </Link>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='action' asChild>
          <Link href={`/dashboard/staff/bookings/${booking.id}`}>
            <Eye className='size-5 transition-all duration-300 ease-in group-hover:text-cyan-300' />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>View Booking</TooltipContent>
    </Tooltip>
  );

  const markPaidBtn =
    canMarkPaid &&
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
        <BadgeCheck className='size-4' />
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
          >
            <BadgeCheck className='size-5 transition-all duration-300 ease-in group-hover:text-green-500' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Mark this booking as paid</TooltipContent>
      </Tooltip>
    ));

  const editButton =
    canEdit &&
    (isCompact ? (
      <button key='edit' className={stubBtn} onClick={() => setEditOpen(true)}>
        <Pencil className='size-4' />
        Edit
      </button>
    ) : (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='action' onClick={() => setEditOpen(true)}>
            <Pencil className='size-5 transition-all duration-300 ease-in group-hover:text-blue-300' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit Booking</TooltipContent>
      </Tooltip>
    ));

  // dialog lives outside the layout branches so it's always mounted once
  const editDialog = canEdit && (
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
                <Ban className='size-4' />
                Cancel
              </button>
            ) : (
              <Button disabled={cancelBooking.isPending} variant='action'>
                <Ban className='size-5 transition-all duration-300 ease-in group-hover:text-[#FF6060]' />
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
              <button className={stubBtn}>
                <RotateCcw className='size-4' />
                Refund
              </button>
            ) : (
              <Button disabled={markRefunded.isPending} variant='action'>
                <Wallet className='size-5 transition-all duration-300 ease-in group-hover:text-green-600' />
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
        {cancelDialog}
        {editButton}
        {editDialog}
        {refundDialog}
      </div>
    );
  }

  // compact / mobile: everything inline, no dropdown
  const stubs = [viewButton, editButton, refundDialog, cancelDialog].filter(
    Boolean,
  );

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
