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
import type { PaymentMethod } from '@/types';

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
      method: PaymentMethod;
    }) => updatePaymentStatus(bookingId, 'paid', method),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: bookingKeys.all }),
  });
}

// export function useMarkRefunded() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (bookingId: string) => {
//       const { error } = await supabase
//         .from('bookings')
//         .update({ payment_status: 'refunded' })
//         .eq('id', bookingId);
//       if (error) throw new Error(error.message);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: bookingKeys.all });
//     },
//   });
// }

export function useMarkRefunded() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      paymentId,
      amount,
    }: {
      bookingId: string;
      paymentId: string;
      amount?: number; // in paise — omit for full refund
    }) => {
      const res = await fetch('/api/razorpay/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, amount }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Refund failed');
      }

      // Only mark refunded in the DB once Razorpay confirms the refund succeeded
      return updatePaymentStatus(bookingId, 'refunded');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
