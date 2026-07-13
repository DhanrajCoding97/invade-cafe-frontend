import { z } from 'zod';

export const bookingSchema = z.object({
  device: z.enum(['pc', 'ps5', 'vr', 'racing']),
  stationId: z.string().min(1, 'Select a station'),
  date: z.date(),
  startTime: z.string().min(1, 'Select a start time'),
  duration: z.number().min(1),
  players: z.number().optional(),
  tier: z.enum(['single', 'multiplayer']).optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
