import { z } from 'zod';

export const createFertilizerLogSchema = z.object({
    cropId: z.string().uuid(),
    quantity: z.preprocess(val => (val ? Number(val) : undefined), z.number().optional()),
    unit: z.string().optional(),
    applicationMethod: z.string().optional(),
    notes: z.string().optional(),
    appliedAt: z.string().optional(),
});

export const createMedicineLogSchema = z.object({
    cropId: z.string().uuid(),
    quantity: z.preprocess(val => (val ? Number(val) : undefined), z.number().optional()),
    unit: z.string().optional(),
    applicationMethod: z.string().optional(),
    notes: z.string().optional(),
    appliedAt: z.string().optional(),
});
