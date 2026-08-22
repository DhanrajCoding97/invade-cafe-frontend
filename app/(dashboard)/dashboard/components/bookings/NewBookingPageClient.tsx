'use client';
import ManualBookingForm from '../../staff/components/ManualBookingForm';
import { useRouter } from 'next/navigation';

export default function NewBookingPageClient() {
  const router = useRouter();
  return (
    <div className='flex flex-col'>
      <ManualBookingForm
        mode='create'
        onSuccess={() => router.push('/dashboard/staff/live-sessions')}
      />
    </div>
  );
}
