import { z } from 'zod';

export const manualBookingSchema = z
  .object({
    customerName: z.string().trim().min(1, 'Name is required'),

    customerPhone: z
      .string()
      .trim()
      .regex(/^[0-9]{10,15}$/, 'Enter a valid phone number'),

    device: z.enum(['pc', 'ps5', 'vr', 'racing'], {
      message: 'Please select a device',
    }),

    stationId: z.string().min(1, 'Select a station'),

    duration: z.coerce.number().min(1),

    players: z.coerce.number().int().min(1).max(4).optional(),

    tier: z.enum(['single', 'multiplayer']).optional(),

    startNow: z.boolean(),

    date: z.date(),

    startTime: z.string(),

    paymentMethod: z.enum(['cash', 'upi_manual', 'complimentary']),

    amountOverride: z.coerce.number().min(0).optional(),

    notes: z.string().max(300).optional(),
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

export type ManualBookingValues = z.infer<typeof manualBookingSchema>;
