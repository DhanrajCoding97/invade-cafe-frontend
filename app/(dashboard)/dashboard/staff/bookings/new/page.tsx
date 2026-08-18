'use client';
import ManualBookingForm from '../../components/ManualBookingForm';
import { useRouter } from 'next/navigation';
export default function NewBookingPage() {
  const router = useRouter();
  return (
    <div className='flex flex-col items-center justify-center'>
      <ManualBookingForm
        mode='create'
        onSuccess={() => router.push('/dashboard/staff/bookings')}
      />
    </div>
  );
}
