// components/bookings/BookingDetailView.tsx
import {
  ArrowLeft,
  Monitor,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  QrCode,
} from 'lucide-react';
import type { ReactNode } from 'react';

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

function DetailTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className='flex items-center gap-2'>
      <div className='flex items-center gap-2 text-[#28F1FF]/70'>
        {icon}
        <span className='font-mono text-xs text-white/40 uppercase tracking-wide'>
          {label}
        </span>
      </div>
      <p className='font-mono text-sm text-white'>{value}</p>
    </div>
  );
}

export function BookingDetailView({
  booking,
  //   backButton,
  actions,
}: {
  booking: any;
  //   backButton: React.ReactNode;
  /** Admin-only action row. Omit on customer route. */
  actions?: ReactNode;
}) {
  const isOnlineBooking = booking.payment_method === 'razorpay';
  return (
    <div
      className='p-3 sm:p-4 lg:p-6 border rounded-2xl'
      // className='min-h-screen bg-black text-white px-4 py-6 md:px-8 md:py-10 max-w-3xl mx-auto'
    >
      {/* Header */}
      {/* <button
        onClick={backButton}
        className='flex items-center gap-2 text-[#28F1FF] hover:text-white transition-colors font-mono text-sm mb-6'
      >
        <ArrowLeft size={16} />
        Back
      </button> */}

      {/* Confirmation banner - district style */}
      <div className=''>
        {/* {backButton} */}
        <div className='flex items-center gap-2 mb-1'>
          <h1 className='font-mono text-xl text-white font-semibold'>
            {booking?.status === 'confirmed'
              ? 'Booking Confirmed'
              : 'Booking Details'}
          </h1>
          {booking?.status === 'confirmed' && (
            <span className='text-emerald-400 text-lg'>✓</span>
          )}
        </div>
        <p className='font-mono text-xs text-white/40'>
          Booking Date: {booking?.created_at}
        </p>
        {isOnlineBooking && (
          <p className='font-mono text-xs text-white/40'>
            Razorpay Order ID: {booking?.razorpay_order_id}
          </p>
        )}
      </div>

      {/* Customer card */}
      <div className='border border-[#28F1FF]/20 rounded-2xl p-5 mb-4 bg-gradient-to-b from-[#28F1FF]/5 to-transparent'>
        <p className='font-mono text-lg text-[#28F1FF]'>
          {booking?.customer_name ?? booking?.profiles?.full_name ?? 'Unknown'}
        </p>
        <p className='font-mono text-sm text-white/50 mt-1'>
          {booking?.customer_phone ??
            booking?.profiles?.phone ??
            'Contact info not provided'}
        </p>
        {booking?.profiles?.email && (
          <p className='font-mono text-xs text-white/40 mt-0.5'>
            {booking.profiles.email}
          </p>
        )}
      </div>

      {/* Status + Payment pills */}
      <div className='flex gap-3 mb-4'>
        <span
          className={`font-mono text-xs px-4 py-1.5 rounded-full border ${statusStyles[booking?.status] ?? 'border-white/20 text-white/70'}`}
        >
          {booking?.status}
        </span>
        <span
          className={`font-mono text-xs px-4 py-1.5 rounded-full border ${paymentStyles[booking?.payment_status] ?? 'border-white/20 text-white/70'}`}
        >
          {booking?.payment_status}
          {booking?.payment_method && (
            <span className='text-white/40 ml-1'>
              · {booking.payment_method}
            </span>
          )}
        </span>
      </div>

      {/* QR block - district style */}
      {booking?.qr_code && (
        <div className='border border-white/10 rounded-2xl p-6 mb-4 flex flex-col items-center'>
          <p className='font-mono text-xs text-white/40 mb-4 uppercase tracking-wide'>
            Scan this QR code at venue
          </p>
          <div className='bg-white p-3 rounded-xl'>
            {/* swap for real QR render (e.g. qrcode.react) */}
            <QrCode size={140} className='text-black' />
          </div>
          <p className='font-mono text-xs text-white/40 mt-4'>Booking ID</p>
          <p className='font-mono text-sm text-white'>{booking?.id}</p>
        </div>
      )}

      {/* Booking details grid */}
      <div className='grid grid-cols-2 gap-3 mb-4'>
        <DetailTile
          icon={<Monitor size={16} />}
          label='Device'
          value={booking?.device}
        />
        <DetailTile
          icon={<Calendar size={16} />}
          label='Date & Time'
          value={`${booking?.date} · ${booking?.start_time}`}
        />
        <DetailTile
          icon={<Clock size={16} />}
          label='Duration'
          value={`${booking?.duration_hours}h`}
        />
        <DetailTile
          icon={<Users size={16} />}
          label='Players'
          value={String(booking?.players)}
        />
      </div>

      {booking?.station_id && (
        <div className='mb-4 border border-white/10 rounded-2xl p-5'>
          <p className='font-mono text-xs text-white/40 mb-1'>Station</p>
          <p className='font-mono text-sm text-white'>{booking.station_id}</p>
        </div>
      )}

      {/* Bill summary - district style */}
      <div className='border border-white/10 rounded-2xl p-5 mb-4'>
        <p className='font-mono text-sm text-white mb-3 font-semibold'>
          Bill Summary
        </p>
        <div className='flex justify-between font-mono text-sm text-white/60 mb-2'>
          <span>Session charges</span>
          <span>₹{booking?.amount}</span>
        </div>
        <div className='border-t border-white/10 pt-3 flex justify-between font-mono text-sm text-white font-semibold'>
          <span>Total Amount Paid</span>
          <span className='flex items-center gap-1'>
            <IndianRupee size={14} />
            {booking?.amount}
          </span>
        </div>
      </div>

      {/* Payment details */}
      <div className='border border-white/10 rounded-2xl p-5 mb-6'>
        <p className='font-mono text-sm text-white mb-1 font-semibold'>
          Payment Details
        </p>
        <p className='font-mono text-xs text-white/40 mb-3'>
          Transaction ID: {booking?.transaction_id ?? '—'}
        </p>
        <div className='flex justify-between font-mono text-sm text-white/70'>
          <span>{booking?.payment_method ?? 'Wallet'}</span>
          <span>₹{booking?.amount}</span>
        </div>
      </div>

      {/* Admin actions slot - customer route just won't pass this */}
      {actions && <div className='flex gap-2 flex-wrap'>{actions}</div>}
    </div>
  );
}
