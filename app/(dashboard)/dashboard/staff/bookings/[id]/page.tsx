// 'use client';
// import { useParams, useRouter } from 'next/navigation';
// import { useQuery } from '@tanstack/react-query';
// import { bookingKeys, fetchBookingById } from '@/lib/queries/bookings';
// import {
//   ArrowLeft,
//   Check,
//   Ban,
//   Pencil,
//   Clock,
//   Users,
//   IndianRupee,
//   Monitor,
//   Calendar,
// } from 'lucide-react';

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

// export default function BookingDetailPage() {
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
//           onClick={() => router.push('/bookings')}
//           className='text-[#28F1FF] text-sm underline underline-offset-4'
//         >
//           Back to bookings
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className='min-h-screen bg-black text-white px-4 py-6 md:px-8 md:py-10 max-w-3xl mx-auto'>
//       {/* Header */}
//       <div className='flex items-center justify-between mb-6'>
//         <button
//           onClick={() => router.push('/bookings')}
//           className='flex items-center gap-2 text-[#28F1FF] hover:text-white transition-colors font-mono text-sm'
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>
//         <div className='flex items-center gap-3'>
//           <button
//             title='Confirm'
//             className='p-2 rounded-full border border-[#28F1FF]/30 hover:border-[#28F1FF] text-[#28F1FF] transition-colors'
//           >
//             <Check size={16} />
//           </button>
//           <button
//             title='Cancel'
//             className='p-2 rounded-full border border-red-400/30 hover:border-red-400 text-red-400 transition-colors'
//           >
//             <Ban size={16} />
//           </button>
//           <button
//             title='Edit'
//             className='p-2 rounded-full border border-white/20 hover:border-white text-white/80 transition-colors'
//           >
//             <Pencil size={16} />
//           </button>
//         </div>
//       </div>

//       {/* Customer card */}
//       <div className='border border-[#28F1FF]/20 rounded-2xl p-5 mb-4 bg-gradient-to-b from-[#28F1FF]/5 to-transparent'>
//         <p className='font-mono text-lg text-[#28F1FF]'>
//           {booking?.customer_name ?? booking?.profiles?.full_name ?? 'Unknown'}
//         </p>
//         <p className='font-mono text-sm text-white/50 mt-1'>
//           {booking?.customer_phone ??
//             booking?.profiles?.phone ??
//             'Contact info Not provided'}
//         </p>
//         {booking?.profiles?.email && (
//           <p className='font-mono text-xs text-white/40 mt-0.5'>
//             {booking?.profiles.email}
//           </p>
//         )}
//       </div>

//       {/* Status + Payment pills */}
//       <div className='flex gap-3 mb-4'>
//         <span
//           className={`font-mono text-xs px-4 py-1.5 rounded-full border ${statusStyles[booking?.status] ?? 'border-white/20 text-white/70'}`}
//         >
//           {booking?.status}
//         </span>
//         <span
//           className={`font-mono text-xs px-4 py-1.5 rounded-full border ${paymentStyles[booking?.payment_status] ?? 'border-white/20 text-white/70'}`}
//         >
//           {booking?.payment_status}
//           {booking?.payment_method && (
//             <span className='text-white/40 ml-1'>
//               · {booking?.payment_method}
//             </span>
//           )}
//         </span>
//       </div>

//       {/* Booking details grid */}
//       <div className='grid-column-1 grid grid-cols-2 gap-3'>
//         <DetailTile
//           icon={<Monitor size={16} />}
//           label='Device'
//           value={booking?.device}
//         />
//         <DetailTile
//           icon={<Calendar size={16} />}
//           label='Date & Time'
//           value={`${booking?.date} · ${booking?.start_time}`}
//         />
//         <DetailTile
//           icon={<Clock size={16} />}
//           label='Duration'
//           value={`${booking?.duration_hours}h`}
//         />
//         <DetailTile
//           icon={<Users size={16} />}
//           label='Players'
//           value={String(booking?.players)}
//         />
//         <DetailTile
//           icon={<IndianRupee size={16} />}
//           label='Amount'
//           value={`₹${booking?.amount}`}
//         />
//       </div>

//       {/* Station info if present */}
//       {booking?.station_id && (
//           <div className='mt-4 border border-white/10 rounded-2xl p-5'>
//           <p className='font-mono text-xs text-white/40 mb-1'>Station</p>
//           <p className='font-mono text-sm text-white'>{booking?.station_id}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// {/* {booking?.uses_vr && (
//   <DetailTile icon={<Monitor size={16} />} label='VR' value='Yes' />
// )} */}

// app/booking/[id]/page.tsx
// 'use client';
// import { useParams, useRouter } from 'next/navigation';
// import { useQuery } from '@tanstack/react-query';
// import { BookingDetailView } from '../../../components/bookings/BookingDetailView';
// import AdminBookingActions from '../../../components/bookings/AdminBookingActions';
// import { bookingKeys, fetchBookingById } from '@/lib/queries/bookings';
// export default function AdminBookingDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();

//   const { data: booking, isLoading } = useQuery({
//     queryKey: bookingKeys.detail(id),
//     queryFn: () => fetchBookingById(id),
//     enabled: !!id,
//   });

//   if (isLoading) return null; // or a skeleton

//   return (
//     <BookingDetailView
//       booking={booking}
//       onBack={() => router.push('/bookings')}
//       actions={<AdminBookingActions booking={booking} />}
//     />
//   );
// }

// app/bookings/[id]/page.tsx

import { notFound } from 'next/navigation';
import { getBookingById } from '@/lib/server/bookings';
import { BookingDetailView } from '../../../components/bookings/BookingDetailView';
import BackButton from '../../../components/shared/BackButton';
import AdminBookingActions from '../../../components/bookings/AdminBookingActions';
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminBookingDetailPage({ params }: Props) {
  const { id } = await params;

  const booking = await getBookingById(id);

  if (!booking) {
    notFound();
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      {/* <h1>Manage this booking</h1> */}
      <BookingDetailView
        booking={booking}
        // backButton={<BackButton />}
        actions={<AdminBookingActions booking={booking} />}
      />
    </div>
  );
}
