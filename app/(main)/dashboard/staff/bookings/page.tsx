'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchBookings, bookingKeys } from '@/lib/queries/bookings';
export default function BookingsPage() {
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: bookingKeys.all,
    queryFn: fetchBookings,
  });

  if (isLoading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div>Failed to load bookings.</div>;
  }
  return (
    <div className='space-y-2'>
      <h1 className='text-2xl font-bold'>Bookings</h1>

      <p>Total bookings: {bookings?.length}</p>

      <pre>{JSON.stringify(bookings, null, 2)}</pre>
    </div>
  );
}
