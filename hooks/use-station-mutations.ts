// hooks/use-station-mutations.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createStation,
  updateStation,
  deleteStation,
  updateStationStatus,
} from '@/app/(dashboard)/dashboard/staff/actions/stations';
import { stationKeys } from '@/lib/queries/stations';
import type { StationType, OperationalStatus, PcSpecs } from '@/types';

interface StationPayload {
  type: StationType;
  name: string;
  hourly_rate: number;
  max_players: number;
  cafe_location: string;
  specs?: PcSpecs | null;
}

export function useCreateStation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StationPayload) => createStation(payload),
    onSuccess: () => {
      toast.success('Station added');
      queryClient.invalidateQueries({ queryKey: stationKeys.all });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    },
  });
}

export function useUpdateStation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<StationPayload>;
    }) => updateStation(id, payload),
    onSuccess: () => {
      toast.success('Station updated');
      queryClient.invalidateQueries({ queryKey: stationKeys.all });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    },
  });
}

export function useDeleteStation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStation(id),
    onSuccess: () => {
      toast.success('Station deleted');
      queryClient.invalidateQueries({ queryKey: stationKeys.all });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    },
  });
}

export function useUpdateStationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: string;
      status: OperationalStatus;
      note?: string;
    }) => updateStationStatus(id, status, note),
    onSuccess: (_data, variables) => {
      toast.success(`Status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: stationKeys.all });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Status update failed');
    },
  });
}
