'use client';

import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
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
      <CornerCutButton
        className='max-w-fit'
        size='sm'
        color='cyan'
        variant='solid'
        showArrow
        hoverEffect='shift'
      >
        <Link href={`/dashboard/customer/bookings/${bookingId}`}>
          View My Booking
        </Link>
      </CornerCutButton>
    </div>
  );
}
