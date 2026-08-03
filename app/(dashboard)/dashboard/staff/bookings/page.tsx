'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchBookings, bookingKeys } from '@/lib/queries/bookings';
import { bookingColumns } from '../../components/columns/bookingColumns';
import { BookingsTable } from '../../components/BookingsTable';
import { useRealtimeBookings } from '@/hooks/use-realtime-booking';

export default function BookingsPage() {
  useRealtimeBookings();
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

  return <BookingsTable columns={bookingColumns} data={bookings ?? []} />;
}
