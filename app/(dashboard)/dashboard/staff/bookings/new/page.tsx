// 'use client';
// import ManualBookingForm from '../../components/ManualBookingForm';
// import { useRouter } from 'next/navigation';
// export default function NewBookingPage() {
//   const router = useRouter();
//   return (
//     <div className='flex flex-col '>
//       <ManualBookingForm
//         mode='create'
//         onSuccess={() => router.push('/dashboard/staff/bookings')}
//       />
//     </div>
//   );
// }
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchCafeSettings } from '@/lib/queries/cafe-settings';
import NewBookingPageClient from '../../../components/bookings/NewBookingPageClient';

export default async function NewBookingPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['cafe-settings'],
    queryFn: fetchCafeSettings,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewBookingPageClient />
    </HydrationBoundary>
  );
}
