import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  ArrowLeft,
  Clock,
  Users,
  IndianRupee,
  Monitor,
  Calendar,
  TvMinimalPlay,
} from 'lucide-react';
import { type BookingRow } from '@/types';
import { CancelBookingButton } from '../../components/cancel-booking-button';
import GoBackLink from '../../components/go-back-link';
import ContactLink from '../../components/ContactLink';
async function fetchBookingById(id: string): Promise<BookingRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      profiles:user_id (full_name, avatar_url, email, phone),
      stations:station_id (name, type)
    `,
    )
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
      <h2 className='text-[clamp(1.25rem,1rem+1.2vw,2.5rem)] font-extrabold whitespace-nowrap'>
        <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
          Booking Summary
        </span>
      </h2>
      <GoBackLink />
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
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
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
          <DetailTile
            icon={<TvMinimalPlay size={16} />}
            label='Station'
            value={booking.stations?.name ?? 'Unknown'}
          />
        </div>

        {/* <div className='grid grid-cols-2 gap-3'>
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
          <DetailTile
            icon={<TvMinimalPlay size={16} />}
            label='Station'
            value={booking.stations?.name ?? 'Unknown'}
          />
        </div> */}

        <ContactLink />
        <CancelBookingButton booking={booking} />
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
    <div className='flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:p-4'>
      <div className='mt-0.5 shrink-0 text-[#28F1FF]/70'>{icon}</div>
      <div className='min-w-0'>
        <p className='font-mono text-[10px] uppercase tracking-wide text-white/40 mb-1'>
          {label}
        </p>
        <p className='font-mono text-sm text-white break-words'>{value}</p>
      </div>
    </div>
  );
}
