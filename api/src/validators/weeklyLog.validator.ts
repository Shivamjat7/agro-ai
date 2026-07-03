import { z } from 'zod';

export const createWeeklyLogSchema = z.object({
    cropId: z.string().uuid(),

    weekNumber: z.number(),

    plantHeight: z.number().optional(),

    leafColor: z.string().optional(),

    healthScore: z.number().optional(),

    irrigationDone: z.boolean().optional(),

    fertilizerApplied: z.boolean().optional(),

    pesticideApplied: z.boolean().optional(),

    farmerNotes: z.string().optional(),
});
