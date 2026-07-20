import { z } from 'zod';

export const bookingSchema = z
  .object({
    device: z.enum(['pc', 'ps5', 'vr', 'racing'], 'Please select a device'),
    stationId: z.string().min(1, 'Select a station'),
    date: z.date(),
    startTime: z.string().min(1, 'Select a start time'),
    duration: z.number().min(1),
    players: z.number().min(1).max(4).optional(),
    tier: z.enum(['single', 'multiplayer']).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.device === 'ps5' && !data.players) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['players'],
        message: 'Select number of players',
      });
    }
    if (data.device === 'racing' && !data.tier) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tier'],
        message: 'Select a mode',
      });
    }
  });

export type BookingFormValues = z.infer<typeof bookingSchema>;
