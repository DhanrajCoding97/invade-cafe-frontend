// 'use client';
// import { useQuery } from '@tanstack/react-query';
// import { fetchBookings, bookingKeys } from '@/lib/queries/bookings';
// import { bookingColumns } from '../../components/columns/bookingColumns';
// import { BookingsTable } from '../../components/BookingsTable';
// import { useRealtimeBookings } from '@/hooks/use-realtime-booking';

// export default function BookingsPage() {
//   useRealtimeBookings();
//   const {
//     data: bookings,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: bookingKeys.all,
//     queryFn: fetchBookings,
//   });

//   if (isLoading) {
//     return <div>Loading bookings...</div>;
//   }

//   if (error) {
//     return <div>Failed to load bookings.</div>;
//   }

//   return <BookingsTable columns={bookingColumns} data={bookings ?? []} />;
// }
// app/dashboard/staff/bookings/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { bookingKeys } from '@/lib/queries/bookings';
import { fetchBookings } from '@/lib/server/bookings';
import BookingsPageClient from '../../components/bookings/BookingPageClient';

export default async function BookingsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: bookingKeys.all,
    queryFn: fetchBookings,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookingsPageClient />
    </HydrationBoundary>
  );
}
