// booking-card.tsx
'use client';

import {
  MoreVertical,
  Ban,
  Pencil,
  Eye,
  IndianRupee,
  RotateCcw,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Badge from '@/app/components/neonblade-ui/badge';
import type { BookingRow } from '@/types';
import { BookingActions } from '@/app/actions/booking-actions';

const STATUS_COLOR: Record<
  BookingRow['status'],
  'blue' | 'amber' | 'red' | 'green'
> = {
  confirmed: 'blue',
  no_show: 'amber',
  cancelled: 'red',
  completed: 'green',
};

// export function BookingCard({
//   booking,
//   onView,
//   onEdit,
//   onCancel,
//   onMarkPaid,
//   onRefund,
// }: BookingCardProps) {
//   const {
//     id,
//     customer_name,
//     customer_phone,
//     device,
//     date,
//     start_time,
//     players,
//     amount,
//     payment_method,
//     payment_status,
//     status,
//     user_id,
//   } = booking;

//   const isOnline = payment_method === 'razorpay';

//   const canCancel = status === 'confirmed';
//   const canMarkPaid = payment_status === 'pending';
//   const canRefund =
//     payment_status === 'paid' &&
//     payment_method === 'razorpay' &&
//     status === 'cancelled';

//   return (
//     <div className='rounded-xl border border-cyan-500/20 bg-black/40 p-4'>
//       {/* Header: name + live status */}
//       <div className='flex items-start justify-between gap-2'>
//         <div>
//           <div className='flex items-center gap-2'>
//             <span className='font-semibold text-cyan-300'>{customer_name}</span>
//             {isOnline && (
//               <Badge color='green' variant='outline' dot='pulse' glow={false}>
//                 Online
//               </Badge>
//             )}
//           </div>
//           <span className='text-sm text-white/50'>{customer_phone}</span>
//         </div>

//         {/* Overflow menu for secondary actions */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <button
//               aria-label='More actions'
//               className='rounded-md p-1.5 text-white/60 hover:bg-white/5 hover:text-white'
//             >
//               <MoreVertical size={18} />
//             </button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuItem onClick={() => onEdit(id)}>
//               <Pencil size={14} className='mr-2' /> Edit
//             </DropdownMenuItem>
//             {canCancel && (
//               <DropdownMenuItem
//                 onClick={() => onCancel(id)}
//                 className='text-red-400'
//               >
//                 <Ban size={14} className='mr-2' /> Cancel booking
//               </DropdownMenuItem>
//             )}
//             {canRefund && (
//               <DropdownMenuItem onClick={() => onRefund(id)}>
//                 <RotateCcw size={14} className='mr-2' /> Issue refund
//               </DropdownMenuItem>
//             )}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {/* Device + datetime */}
//       <div className='mt-3 flex items-center gap-2 text-sm text-white/70'>
//         <span>{device}</span>
//         <span className='text-white/30'>·</span>
//         <span>
//           {date}, {start_time}
//         </span>
//       </div>

//       {/* Status + payment */}
//       <div className='mt-3 flex items-center justify-between'>
//         <Badge color={STATUS_COLOR[status]} variant='outline' glow={false}>
//           {status}
//         </Badge>
//         <span className='text-xs text-white/50'>
//           {payment_status} · {payment_method}
//         </span>
//       </div>

//       {/* Primary actions row */}
//       <div className='mt-4 flex gap-2'>
//         <button
//           onClick={() => onView(id)}
//           className='flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-sm text-white/80 active:bg-white/5'
//         >
//           <Eye size={14} /> View
//         </button>
//         {canMarkPaid && (
//           <button
//             onClick={() => onMarkPaid(id)}
//             className='flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-cyan-500/30 py-2 text-sm text-cyan-300 active:bg-cyan-500/10'
//           >
//             <IndianRupee size={14} /> Mark Paid
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export function BookingCard({ booking }: { booking: BookingRow }) {
//   if (!booking) return null;

//   const isOnline = booking.payment_method === 'razorpay';
//   const displayName =
//     booking.profiles?.full_name ?? booking.customer_name ?? 'Guest';
//   const displayPhone = booking.profiles?.phone ?? booking.customer_phone ?? '—';

//   return (
//     <div className='rounded-xl border border-cyan-500/20 bg-black/40 p-4'>
//       {/* Header row: name/phone on left, actions menu on right — real flex, not absolute */}
//       <div className='flex items-start justify-between gap-2'>
//         <div className='min-w-0'>
//           <div className='flex flex-wrap items-center gap-2'>
//             <span className='truncate font-semibold text-cyan-300'>
//               {displayName}
//             </span>
//             {isOnline && (
//               <Badge color='green' variant='outline' dot='pulse' glow={false}>
//                 Online
//               </Badge>
//             )}
//           </div>
//           <span className='text-sm text-white/50'>{displayPhone}</span>
//         </div>

//         <div className='shrink-0'>
//           <BookingActions booking={booking} layout='compact' />
//         </div>
//       </div>

//       {/* Device + datetime */}
//       <div className='mt-3 flex items-center gap-2 text-sm text-white/70'>
//         <span>{booking.device}</span>
//         <span className='text-white/30'>·</span>
//         <span>
//           {booking.date}, {booking.start_time}
//         </span>
//       </div>

//       {/* Duration / Players / Amount — matches desktop table columns */}
//       <div className='mt-2 flex items-center gap-4 text-xs text-white/50'>
//         <span>{booking.duration_hours ?? 1}h</span>
//         <span>
//           {booking.players} {booking.players === 1 ? 'player' : 'players'}
//         </span>
//         <span className='font-medium text-white/70'>₹{booking.amount}</span>
//       </div>

//       {/* Status + payment */}
//       <div className='mt-3 flex items-center justify-between border-t border-white/5 pt-3'>
//         <Badge
//           color={STATUS_COLOR[booking.status]}
//           variant='outline'
//           glow={false}
//         >
//           {booking.status}
//         </Badge>
//         <span className='text-xs text-white/50'>
//           {booking.payment_status} · {booking.payment_method}
//         </span>
//       </div>
//     </div>
//   );
// }
export function BookingCard({
  booking,
  role,
}: {
  booking: BookingRow;
  role: 'owner' | 'staff' | undefined;
}) {
  if (!booking) return null;

  const isOnline = booking.payment_method === 'razorpay';
  const displayName =
    booking.profiles?.full_name ?? booking.customer_name ?? 'Guest';
  const displayPhone = booking.profiles?.phone ?? booking.customer_phone ?? '—';

  return (
    <div className='relative overflow-hidden rounded-xl border border-cyan-500/20 bg-black/40'>
      {/* top accent */}
      <div className='h-0.5 w-full bg-gradient-to-r from-cyan-500/60 via-cyan-400/20 to-transparent' />

      {/* header */}
      <div className='flex items-start justify-between gap-3 px-4 pt-4'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='truncate font-semibold text-cyan-300'>
              {displayName}
            </span>
            {isOnline && (
              <Badge color='green' variant='outline' dot='pulse' glow={false}>
                Online
              </Badge>
            )}
          </div>
          <span className='font-mono text-xs text-white/40'>
            {displayPhone}
          </span>
        </div>

        <Badge
          color={STATUS_COLOR[booking.status]}
          variant='outline'
          glow={false}
          className='shrink-0 uppercase'
        >
          {booking.status}
        </Badge>
      </div>

      {/* receipt lines */}
      <div className='mt-4 space-y-1.5 px-4 font-mono text-xs'>
        <ReceiptLine label='Station' value={booking.device} />
        <ReceiptLine label='Date' value={booking.date} />
        <ReceiptLine label='Time' value={booking.start_time} />
        <ReceiptLine
          label='Duration'
          value={`${booking.duration_hours ?? 1}h`}
        />
        <ReceiptLine
          label='Players'
          value={`${booking.players} ${booking.players === 1 ? 'player' : 'players'}`}
        />
        <ReceiptLine
          label='Payment'
          value={`${booking.payment_status} · ${booking.payment_method ?? '—'}`}
        />
      </div>

      {/* total */}
      <div className='mt-3 flex items-end justify-between px-4 pb-4'>
        <span className='font-mono text-[10px] uppercase tracking-[0.2em] text-white/40'>
          Total
        </span>
        <span className='text-2xl font-semibold tabular-nums text-cyan-300'>
          ₹{booking.amount}
        </span>
      </div>

      {/* perforation */}
      <div className='relative flex h-4 items-center'>
        <div className='absolute left-0 size-4 -translate-x-1/2 rounded-full bg-background ring-1 ring-cyan-500/20' />
        <div className='mx-3 w-full border-t border-dashed border-white/15' />
        <div className='absolute right-0 size-4 translate-x-1/2 rounded-full bg-background ring-1 ring-cyan-500/20' />
      </div>

      {/* action stub */}
      <div className='px-4 pb-4 pt-2'>
        <BookingActions role={role} booking={booking} layout='compact' />
      </div>
    </div>
  );
}

function ReceiptLine({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-baseline gap-2'>
      <span className='uppercase tracking-wider text-white/35'>{label}</span>
      <span className='min-w-0 flex-1 translate-y-[-3px] border-b border-dotted border-white/10' />
      <span className='text-right text-white/80'>{value}</span>
    </div>
  );
}
