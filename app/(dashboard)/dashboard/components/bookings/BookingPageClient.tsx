// app/dashboard/staff/bookings/BookingsPageClient.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchBookings, bookingKeys } from '@/lib/queries/bookings';
import { bookingColumns } from '../../components/columns/bookingColumns';
import { BookingsTable } from '../../components/BookingsTable';
import { useRealtimeBookings } from '@/hooks/use-realtime-booking';
import { BookingsTableSkeleton } from '@/components/skeletons/BookingsTableSkeleton';

const BOOKING_STALE_TIME = 30_000;

export default function BookingsPageClient({
  role,
}: {
  role: 'owner' | 'staff';
}) {
  useRealtimeBookings();
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: bookingKeys.all,
    queryFn: fetchBookings,
    staleTime: BOOKING_STALE_TIME,
  });

  // isLoading will now be false on first render — data arrives pre-hydrated
  // from the server prefetch, so this branch only fires on a client-side
  // refetch that somehow beats cache (rare) or a hard client navigation
  // without the server wrapper.
  if (isLoading) {
    return <BookingsTableSkeleton />;
  }

  if (error) {
    return <div>Failed to load bookings.</div>;
  }

  return (
    <BookingsTable columns={bookingColumns} data={bookings ?? []} role={role} />
  );
}
