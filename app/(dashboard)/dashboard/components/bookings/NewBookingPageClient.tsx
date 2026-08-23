'use client';
import ManualBookingForm from '../../staff/components/ManualBookingForm';
import { useRouter } from 'next/navigation';

export default function NewBookingPageClient() {
  const router = useRouter();
  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h2 className='text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] font-extrabold '>
          <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
            Add New Booking
          </span>
        </h2>
        <p className='max-w-[80ch] text-[clamp(0.875rem,0.8rem+0.3vw,1rem)] leading-6 text-[#bcbcbc]'>
          View, manage, and track all customer bookings.
        </p>
      </div>
      <ManualBookingForm
        mode='create'
        onSuccess={() => router.push('/dashboard/staff/live-sessions')}
      />
    </div>
  );
}
