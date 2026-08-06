import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { profileKeys, fetchMyProfile } from '@/lib/queries/profile';
import {
  useCancelBooking,
  useMarkPaid,
  useMarkRefunded,
} from './use-booking-mutations';
import type { BookingRow } from '@/types/index';

export function useBookingActionState(booking: BookingRow) {
  const [editOpen, setEditOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: profileKeys.me,
    queryFn: fetchMyProfile,
  });
  const role = profile?.role;

  const cancelBooking = useCancelBooking();
  const markPaid = useMarkPaid();
  const markRefunded = useMarkRefunded();
  const isOnlineBooking = booking.payment_method === 'razorpay';

  const canMarkPaid =
    booking.payment_status === 'pending' &&
    booking.payment_method !== 'razorpay';

  const canCancel =
    booking.status !== 'completed' &&
    booking.status !== 'no_show' &&
    (role === 'owner' || (role === 'staff' && !isOnlineBooking));

  const canEdit =
    booking.status !== 'completed' && booking.status !== 'no_show';

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
    cancelBooking,
    markPaid,
    markRefunded,
    canMarkPaid,
    canCancel,
    canEdit,
    canRefund,
  };
}
