'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createGame,
  updateGame,
  deleteGame,
} from '@/app/(dashboard)/dashboard/staff/actions/games';
import { gameKeys } from '@/lib/queries/games';
import { toast } from 'sonner';
import { type GameInput } from '@/types';

export function useGameMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createGame,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: gameKeys.all,
      });

      toast.success('Game created');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: GameInput }) =>
      updateGame(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: gameKeys.all,
      });

      toast.success('Game updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGame,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: gameKeys.all,
      });

      toast.success('Game deleted');
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
