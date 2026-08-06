'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/dashboard/staff/bookings')}
      className='flex items-center gap-2'
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}
