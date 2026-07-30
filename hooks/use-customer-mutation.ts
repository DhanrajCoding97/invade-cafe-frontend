// hooks/use-customer-mutations.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserRole } from '@/app/(dashboard)/dashboard/staff/actions/customer-action';

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: 'owner' | 'staff' | 'customer';
    }) => updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
