'use client';
import { useState } from 'react';
import {
  useCancelBooking,
  useMarkPaid,
  useMarkRefunded,
  useMarkBookingAndExtensionsPaid,
  useMarkExtensionPaid,
} from './use-booking-mutations';
import type { BookingRow } from '@/types/index';

// const onSuccess = options?.onMutationSuccess;
export function useBookingActionState(
  booking: BookingRow,
  role: 'owner' | 'staff' | undefined,
  options?: { onMutationSuccess?: () => void },
) {
  const [editOpen, setEditOpen] = useState(false);
  const onSuccess = options?.onMutationSuccess;
  const cancelBooking = useCancelBooking({ onSuccess });
  const markPaid = useMarkPaid({ onSuccess });
  const markBookingAndExtensionsPaid = useMarkBookingAndExtensionsPaid({
    onSuccess,
  });
  const markExtensionPaid = useMarkExtensionPaid({ onSuccess });
  const markRefunded = useMarkRefunded({ onSuccess });

  const isOnlineBooking = booking.payment_method === 'razorpay';
  const extensions = booking.session_extensions ?? [];
  const isManualBooking = !isOnlineBooking;
  const hasPendingExtension = extensions.some(
    (ext) => ext.payment_status === 'pending',
  );

  const canMarkPaid = booking.payment_status === 'pending' && isManualBooking;

  const canMarkBookingAndExtensionsPaid =
    booking.payment_status === 'pending' &&
    isManualBooking &&
    hasPendingExtension;

  const canMarkExtensionPaid = isOnlineBooking && hasPendingExtension;
  const canCancel =
    booking.status !== 'completed' &&
    booking.status !== 'no_show' &&
    (role === 'owner' || (role === 'staff' && !isOnlineBooking));

  const canEdit = true;

  const canRefund =
    (booking.status === 'completed' || booking.status === 'no_show') &&
    !!booking.user_id &&
    booking.payment_status === 'paid' &&
    booking.payment_method === 'razorpay' &&
    !!booking.razorpay_payment_id;

  return {
    role,
    editOpen,
    setEditOpen,
    hasPendingExtension,

    cancelBooking,
    markPaid,
    markRefunded,
    markBookingAndExtensionsPaid,
    markExtensionPaid,

    canMarkPaid,
    canMarkBookingAndExtensionsPaid,
    canMarkExtensionPaid,
    canCancel,
    canEdit,
    canRefund,
  };
}
