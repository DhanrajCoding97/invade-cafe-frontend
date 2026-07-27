// hooks/use-booking-mutations.ts
'use client';
import { createClient } from '@/lib/supabase/client';
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

export function useMarkRefunded() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'refunded' })
        .eq('id', bookingId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
