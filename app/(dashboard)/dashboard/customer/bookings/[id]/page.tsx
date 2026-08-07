// 'use client';

// import { useParams, useRouter } from 'next/navigation';
// import { useQuery } from '@tanstack/react-query';
// import { bookingKeys, fetchBookingById } from '@/lib/queries/bookings';
// import {
//   ArrowLeft,
//   Clock,
//   Users,
//   IndianRupee,
//   Monitor,
//   Calendar,
//   XCircle,
// } from 'lucide-react';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogMedia,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
// import { useCancelMyBooking } from '@/hooks/use-customer-booking';
// import { useRefundPercent } from '@/hooks/use-refund-percent';
// import { Button } from '@/components/ui/button';
// import { type BookingRow } from '@/types';
// export default function CustomerBookingDetailPage() {
//   function hoursUntil(booking: BookingRow) {
//     const start = new Date(`${booking.date}T${booking.start_time}`);
//     return (start.getTime() - Date.now()) / 3_600_000;
//   }
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();

//   const {
//     data: booking,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: bookingKeys.detail(id),
//     queryFn: () => fetchBookingById(id),
//     enabled: !!id,
//   });

//   const cancelMutation = useCancelMyBooking();
//   const { data: refundData } = useRefundPercent();

//   if (isLoading) {
//     return (
//       <div className='flex items-center justify-center min-h-[60vh]'>
//         <div className='h-8 w-8 border-2 border-[#28F1FF]/30 border-t-[#28F1FF] rounded-full animate-spin' />
//       </div>
//     );
//   }

//   if (error || !booking) {
//     return (
//       <div className='flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4'>
//         <p className='text-red-400 font-mono'>
//           {error instanceof Error ? error.message : 'Booking not found'}
//         </p>
//         <button
//           onClick={() => router.push('/dashboard/customer')}
//           className='text-[#28F1FF] text-sm underline underline-offset-4'
//         >
//           Back to Dashboard
//         </button>
//       </div>
//     );
//   }

//   const statusStyles: Record<string, string> = {
//     confirmed: 'bg-blue-500/10 text-blue-300 border-blue-400/40',
//     pending: 'bg-orange-500/10 text-orange-300 border-orange-400/40',
//     cancelled: 'bg-red-500/10 text-red-300 border-red-400/40',
//     completed: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/40',
//   };

//   const paymentStyles: Record<string, string> = {
//     pending: 'bg-orange-600/20 text-orange-300 border-orange-500/40',
//     paid: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40',
//   };

//   const refundPercent = refundData?.refundPercent ?? 100;

//   const hrsLeft = hoursUntil(booking);
//   const canCancel = booking.status === 'confirmed' && hrsLeft >= 2;
//   //   const canCancel =
//   //     booking.status === 'pending' || booking.status === 'confirmed';

//   return (
//     <div className='min-h-screen bg-black text-white px-4 py-6 md:px-8 md:py-10 max-w-3xl mx-auto'>
//       {/* Header */}
//       <div className='flex items-center justify-between mb-6'>
//         <button
//           onClick={() => router.push('/dashboard/customer')}
//           className='flex items-center gap-2 text-[#28F1FF] hover:text-white transition-colors font-mono text-sm'
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>

//         {canCancel && (
//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button disabled={!canCancel} variant='destructive'>
//                 Cancel Booking
//               </Button>
//             </AlertDialogTrigger>

//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Cancel booking?</AlertDialogTitle>

//                 <AlertDialogDescription>
//                   This will permanently cancel your booking. You will receive a{' '}
//                   <strong>{refundPercent}% refund</strong>.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>

//               <AlertDialogFooter>
//                 <AlertDialogCancel>Keep Booking</AlertDialogCancel>

//                 <AlertDialogAction
//                   onClick={() => cancelMutation.mutate(booking.id)}
//                   variant='destructive'
//                 >
//                   Cancel Booking
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         )}
//       </div>

//       {/* Status + Payment pills */}
//       <div className='flex gap-3 mb-4'>
//         <span
//           className={`font-mono text-xs px-4 py-1.5 rounded-full border ${statusStyles[booking.status] ?? 'border-white/20 text-white/70'}`}
//         >
//           {booking.status}
//         </span>
//         <span
//           className={`font-mono text-xs px-4 py-1.5 rounded-full border ${paymentStyles[booking.payment_status] ?? 'border-white/20 text-white/70'}`}
//         >
//           {booking.payment_status}
//           {booking.payment_method && (
//             <span className='text-white/40 ml-1'>
//               · {booking.payment_method}
//             </span>
//           )}
//         </span>
//       </div>

//       {/* Booking details grid */}
//       <div className='grid grid-cols-2 gap-3'>
//         <DetailTile
//           icon={<Monitor size={16} />}
//           label='Device'
//           value={booking.device}
//         />
//         <DetailTile
//           icon={<Calendar size={16} />}
//           label='Date & Time'
//           value={`${booking.date} · ${booking.start_time}`}
//         />
//         <DetailTile
//           icon={<Clock size={16} />}
//           label='Duration'
//           value={`${booking.duration_hours}h`}
//         />
//         <DetailTile
//           icon={<Users size={16} />}
//           label='Players'
//           value={String(booking.players)}
//         />
//         <DetailTile
//           icon={<IndianRupee size={16} />}
//           label='Amount'
//           value={`₹${booking.amount}`}
//         />
//         {/* {booking.uses_vr && (
//           <DetailTile icon={<Monitor size={16} />} label='VR' value='Yes' />
//         )} */}
//       </div>

//       {/* Station info if present */}
//       {booking.station_id && (
//         <div className='mt-4 border border-white/10 rounded-2xl p-5'>
//           <p className='font-mono text-xs text-white/40 mb-1'>Station</p>
//           <p className='font-mono text-sm text-white'>{booking.station_id}</p>
//         </div>
//       )}

//       {/* Support note */}
//       <p className='mt-6 text-xs text-white/30 font-mono text-center'>
//         Need help with this booking? Contact the front desk.
//       </p>
//     </div>
//   );
// }

// function DetailTile({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className='border border-white/10 rounded-2xl p-4 bg-white/[0.02]'>
//       <div className='flex items-center gap-2 text-[#28F1FF]/70 mb-2'>
//         {icon}
//         <span className='font-mono text-xs text-white/40 uppercase tracking-wide'>
//           {label}
//         </span>
//       </div>
//       <p className='font-mono text-sm text-white'>{value}</p>
//     </div>
//   );
// }
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  ArrowLeft,
  Clock,
  Users,
  IndianRupee,
  Monitor,
  Calendar,
} from 'lucide-react';
// import Link from 'next/link';
import { type BookingRow } from '@/types';
import { CancelBookingButton } from '../../components/cancel-booking-button';
import GoBackLink from '../../components/go-back-link';

async function fetchBookingById(id: string): Promise<BookingRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, profiles:user_id (full_name, avatar_url, email, phone)`)
    .eq('id', id)
    .single();

  if (error) return null;
  return data as BookingRow;
}

const statusStyles: Record<string, string> = {
  confirmed: 'bg-blue-500/10 text-blue-300 border-blue-400/40',
  pending: 'bg-orange-500/10 text-orange-300 border-orange-400/40',
  cancelled: 'bg-red-500/10 text-red-300 border-red-400/40',
  completed: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/40',
};

const paymentStyles: Record<string, string> = {
  pending: 'bg-orange-600/20 text-orange-300 border-orange-500/40',
  paid: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40',
};

export default async function CustomerBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await fetchBookingById(id);

  if (!booking) notFound();

  return (
    <div className='min-h-screen bg-black text-white px-4 py-6 md:px-8 md:py-10 max-w-3xl mx-auto'>
      <h2 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold mb-2'>
        <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
          Booking Summary
        </span>
      </h2>
      <div className='flex flex-col gap-4 border p-2 sm:p-4 rounded-xl'>
        <div className='flex gap-3'>
          <span
            className={`font-mono text-xs px-4 py-1.5 rounded-full border ${statusStyles[booking.status] ?? 'border-white/20 text-white/70'}`}
          >
            {booking.status}
          </span>
          <span
            className={`font-mono text-xs px-4 py-1.5 rounded-full border ${paymentStyles[booking.payment_status] ?? 'border-white/20 text-white/70'}`}
          >
            {booking.payment_status}
            {booking.payment_method && (
              <span className='text-white/40 ml-1'>
                · {booking.payment_method}
              </span>
            )}
          </span>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <DetailTile
            icon={<Monitor size={16} />}
            label='Device'
            value={booking.device}
          />
          <DetailTile
            icon={<Calendar size={16} />}
            label='Date & Time'
            value={`${booking.date} · ${booking.start_time}`}
          />
          <DetailTile
            icon={<Clock size={16} />}
            label='Duration'
            value={`${booking.duration_hours}h`}
          />
          <DetailTile
            icon={<Users size={16} />}
            label='Players'
            value={String(booking.players)}
          />
          <DetailTile
            icon={<IndianRupee size={16} />}
            label='Amount'
            value={`₹${booking.amount}`}
          />
        </div>

        {booking.station_id && (
          <div className='border border-white/10 rounded-2xl p-5'>
            <p className='font-mono text-xs text-white/40 mb-1'>Station</p>
            <p className='font-mono text-sm text-white'>{booking.station_id}</p>
          </div>
        )}

        <p className='text-xs text-white/30 font-mono text-center'>
          Need help with this booking? Contact the front desk.
        </p>

        <div className='flex items-center justify-between'>
          <GoBackLink />
          <CancelBookingButton booking={booking} />
        </div>
      </div>
    </div>
  );
}

function DetailTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className='border border-white/10 rounded-2xl p-4 bg-white/[0.02]'>
      <div className='flex items-center gap-2 text-[#28F1FF]/70 mb-2'>
        {icon}
        <span className='font-mono text-xs text-white/40 uppercase tracking-wide'>
          {label}
        </span>
      </div>
      <p className='font-mono text-sm text-white'>{value}</p>
    </div>
  );
}
