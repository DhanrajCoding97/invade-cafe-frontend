import { useQuery } from '@tanstack/react-query';
import { getRefundPercent } from '@/app/(dashboard)/dashboard/customer/actions/customer-booking';

export function useRefundPercent() {
  return useQuery({
    queryKey: ['refund-percent'],
    queryFn: getRefundPercent,
  });
}
