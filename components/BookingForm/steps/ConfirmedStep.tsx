'use client';

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
    <div className='space-y-4 text-center'>
      <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400'>
        ✓
      </div>
      <h3 className='text-lg font-bold text-white'>You're booked in!</h3>
      <p className='text-sm text-white/60'>
        Booking reference:{' '}
        <span className='text-cyan-300'>
          {bookingId.slice(0, 8).toUpperCase()}
        </span>
      </p>
      <p className='text-xs text-white/40'>
        We've sent a confirmation to your email. See you at the rig!
      </p>
    </div>
  );
}
