import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { bookingKeys } from '@/lib/queries/bookings';
import { fetchBookingsServer } from '@/lib/server/bookings';
import BookingsPageClient from '../../components/bookings/BookingPageClient';
import { requireRole } from '@/lib/auth/requrireRole';
const BOOKING_STALE_TIME = 30_000;
export default async function BookingsPage() {
  const { user, role } = await requireRole(['owner', 'staff']);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: bookingKeys.all,
    queryFn: fetchBookingsServer,
    staleTime: BOOKING_STALE_TIME,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookingsPageClient role={role} user={user} />
    </HydrationBoundary>
  );
}
