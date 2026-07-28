// hooks/use-update-phone.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useUpdatePhone() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      userId,
      phone,
    }: {
      userId: string;
      phone: string;
    }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ phone })
        .eq('id', userId);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}
