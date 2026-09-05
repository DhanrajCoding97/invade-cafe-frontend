import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const manualBookingSchema = z
  .object({
    customerName: z.string().trim().min(1, 'Name is required'),

    customerEmail: z
      .string()
      .trim()
      .email('Invalid email')
      .optional()
      .or(z.literal('')),

    otherNames: z
      .array(z.string().trim().min(1, 'Player name is required'))
      .optional(),

    customerPhone: z
      .string()
      .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),

    device: z.enum(['pc', 'ps5', 'vr', 'racing'], {
      message: 'Please select a device',
    }),

    stationId: z.string().min(1, 'Select a station'),

    linkedStationId: z.string().check(z.uuid()).nullable().optional(),

    duration: z.number().min(1),

    players: z.number().int().min(1).max(4).optional(),

    tier: z.enum(['single', 'multiplayer']).optional(),

    startNow: z.boolean(),

    date: z.date(),

    startTime: z.string(),

    paymentMethod: z.enum(['cash', 'upi_manual', 'complimentary']),

    // amountOverride: z.number().min(0).optional(),
    amountOverride: z.number().min(0).nullable().optional(),

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
