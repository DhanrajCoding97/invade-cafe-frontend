'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ConfirmationStepProps {
  bookingId: string | null;
}

export default function ConfirmationStep({ bookingId }: ConfirmationStepProps) {
  if (!bookingId) {
    return (
      <p className='text-sm text-red-400'>
        Something went wrong — no booking found.
      </p>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400'>
        ✓
      </div>
      <h3 className='text-lg font-bold text-white tracking-wider'>
        You&apos;re booked in!
      </h3>
      <p className='text-sm text-[#bbbbbb] tracking-wider'>
        Booking reference:{' '}
        <span className='text-cyan-300'>
          {bookingId.slice(0, 8).toUpperCase()}
        </span>
      </p>
      <p className='text-xs text-[#bbbbbb] text-center font-light tracking-wider'>
        You can manage or cancel your booking from the dashboard.
      </p>
      <Link
        href={`/dashboard/customer/bookings/${bookingId}`}
        className='max-w-[80%] group cursor-pointer font-bold transition-all duration-300 ease-in-out border flex items-center text-[15px] px-5 py-2.5 rounded-xl border-transparent active:scale-95 bg-[#00F3FF] hover:bg-[#39FF14] text-black
        '
      >
        View My Booking
        <ArrowRight className='w-8.5 transition-transform duration-300 ease-in-out ml-2.5 group-hover:translate-x-1.25' />
        {/* <span className='relative'>View my Booking</span> */}
      </Link>
    </div>
  );
}
