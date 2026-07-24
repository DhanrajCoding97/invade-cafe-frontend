// hooks/use-booking-mutations.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingKeys } from '@/lib/queries/bookings';
import {
  cancelBooking,
  updatePaymentStatus,
  //   updateBooking,
} from '@/app/actions/bookings';

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: bookingKeys.all }),
  });
}

export function useMarkPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      method,
    }: {
      bookingId: string;
      method: string;
    }) => updatePaymentStatus(bookingId, 'paid', method),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: bookingKeys.all }),
  });
}
