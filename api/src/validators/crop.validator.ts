import { z } from 'zod';

export const createCropSchema = z.object({
    farmId: z.number(),

    cropName: z.string().min(2),

    variety: z.string().optional(),

    soilType: z.string().optional(),

    sowingDate: z.string(),

    expectedHarvestDate: z.string().optional(),
});

export const updateCropSchema = createCropSchema.partial();
