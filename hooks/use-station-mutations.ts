'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createStation,
  updateStation,
  updateStationOperationalStatus,
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

export function useUpdateStationOperationalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      operational_status,
      admin_note,
    }: {
      id: string;
      operational_status: OperationalStatus;
      admin_note?: string;
    }) => updateStationOperationalStatus(id, operational_status, admin_note),
    onSuccess: (_data, variables) => {
      toast.success(`Status updated to ${variables.operational_status}`);
      queryClient.invalidateQueries({ queryKey: stationKeys.all });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Status update failed');
    },
  });
}
