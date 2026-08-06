import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex min-h-[50vh] flex-col items-center justify-center gap-4'>
      <h2 className='text-2xl font-semibold'>Booking not found</h2>

      <Link href='/dashboard/bookings'>Back to bookings</Link>
    </div>
  );
}
