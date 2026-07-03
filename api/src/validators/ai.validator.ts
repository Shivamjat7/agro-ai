import { z } from 'zod';

export const analyzeProductSchema = z.object({
    imageUrl: z.string().url(),
    cropId: z.string().uuid(),
});

export const analyzeLeafSchema = z.object({
    imageUrl: z.string().url(),
    cropId: z.string().uuid(),
});
