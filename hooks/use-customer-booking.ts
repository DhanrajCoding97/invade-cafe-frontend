'use client';
import { createClient } from '@/lib/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelMyBooking } from '@/app/(dashboard)/dashboard/customer/actions/customer-booking';
import type { BookingRow } from '@/types';

export const customerBookingKeys = {
  all: ['my-bookings'] as const,
};

export function useMyBookings() {
  const supabase = createClient();

  return useQuery({
    queryKey: customerBookingKeys.all,
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('start_time', { ascending: false });

      if (error) throw new Error(error.message);
      return data as BookingRow[];
    },
  });
}

export function useCancelMyBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => cancelMyBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerBookingKeys.all });
      queryClient.invalidateQueries({ queryKey: ['refund-percent'] }); // match your actual key
    },
  });
}
