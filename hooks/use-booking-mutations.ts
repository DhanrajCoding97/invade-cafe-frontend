'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingKeys } from '@/lib/queries/bookings';
import {
  cancelBooking,
  updatePaymentStatus,
  markExtensionPaid,
  markBookingAndExtensionsPaid,
} from '@/app/actions/bookings';
import { toast } from 'sonner';
import type { PaymentMethod } from '@/types';
// import { markExtensionPaid } from '@/app/(dashboard)/dashboard/staff/actions/booking-action';
export function useCancelBooking(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.all,
      });
    },

    onError: (err) => {
      console.log('toast about to show');

      setTimeout(() => {
        toast.error(err.message);
      }, 0);
    },
  });
}
// export function useCancelBooking(options?: { onSuccess?: () => void }) {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (bookingId: string) => cancelBooking(bookingId),
//     onSuccess: () =>
//       queryClient.invalidateQueries({ queryKey: bookingKeys.all }),
//     options?.onSuccess?.();
//     onError: (err) => {
//       console.log('toast about to show');
//       setTimeout(() => {
//         toast.error(err.message);
//       }, 0);
//     },
//   });
// }

export function useMarkBookingAndExtensionsPaid(options?: {
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      method,
    }: {
      bookingId: string;
      method: PaymentMethod;
    }) => markBookingAndExtensionsPaid(bookingId, method),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      });

      queryClient.invalidateQueries({
        queryKey: ['session-extensions'],
      });
      options?.onSuccess?.();
    },
  });
}

export function useMarkPaid(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      method,
    }: {
      bookingId: string;
      method: PaymentMethod;
    }) => updatePaymentStatus(bookingId, 'paid', method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      options?.onSuccess?.();
    },
  });
}

// export function useMarkRefunded() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       bookingId,
//       paymentId,
//       amount,
//     }: {
//       bookingId: string;
//       paymentId: string;
//       amount?: number; // in paise — omit for full refund
//     }) => {
//       const res = await fetch('/api/razorpay/refund', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ paymentId, amount }),
//       });

//       if (!res.ok) {
//         const body = await res.json().catch(() => ({}));
//         throw new Error(body.error ?? 'Refund failed');
//       }

//       // Only mark refunded in the DB once Razorpay confirms the refund succeeded
//       return updatePaymentStatus(bookingId, 'refunded');
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: bookingKeys.all });
//     },
//   });
// }
export function useMarkRefunded(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      paymentId,
      amount,
    }: {
      paymentId: string;
      amount?: number;
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

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      options?.onSuccess?.();
    },
  });
}

export function useMarkExtensionPaid(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      extensionId,
      markedPaidBy,
    }: {
      extensionId: string;
      markedPaidBy: string;
    }) => markExtensionPaid(extensionId, markedPaidBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      options?.onSuccess?.();
    },
  });
}

// export function useMarkExtensionPaid() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (extensionId: string) => markExtensionPaid(extensionId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['session-extensions'] });
//     },
//     onError: (err: any) => toast.error(err?.message ?? 'Failed to mark paid'),
//   });
// }
