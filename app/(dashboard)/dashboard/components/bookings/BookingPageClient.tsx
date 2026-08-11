// app/dashboard/staff/bookings/BookingsPageClient.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchBookings, bookingKeys } from '@/lib/queries/bookings';
import { bookingColumns } from '../../components/columns/bookingColumns';
import { BookingsTable } from '../../components/BookingsTable';
import { useRealtimeBookings } from '@/hooks/use-realtime-booking';

export default function BookingsPageClient() {
  useRealtimeBookings();
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: bookingKeys.all,
    queryFn: fetchBookings,
  });

  // isLoading will now be false on first render — data arrives pre-hydrated
  // from the server prefetch, so this branch only fires on a client-side
  // refetch that somehow beats cache (rare) or a hard client navigation
  // without the server wrapper.
  if (isLoading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div>Failed to load bookings.</div>;
  }

  return <BookingsTable columns={bookingColumns} data={bookings ?? []} />;
}
