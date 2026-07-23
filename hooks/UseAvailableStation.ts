import { useQuery } from '@tanstack/react-query';
import { stationKeys, fetchAvailableStations } from '@/lib/queries/stations';

export function useAvailableStations(window: {
  date: string;
  startTime: string;
  duration: number;
}) {
  return useQuery({
    queryKey: stationKeys.available(
      window.date,
      window.startTime,
      window.duration,
    ),
    queryFn: () => fetchAvailableStations(window),
    enabled: !!window.date && !!window.startTime && !!window.duration,
  });
}
