'use client';
import ManualBookingForm from '../../components/ManualBookingForm';
import { useRouter } from 'next/navigation';
export default function NewBookingPage() {
  const router = useRouter();
  return (
    <ManualBookingForm
      mode='create'
      // onSuccess={(bookingId) => {
      //   router.push('/dashboard/staff/bookings');
      // }}
      onSuccess={() => router.push('/dashboard/staff/bookings')}
    />
  );
}
