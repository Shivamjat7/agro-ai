import { z } from "zod";

export const createFarmSchema = z.object({
  farmName: z.string().min(2).max(100),

  village: z.string().min(2),

  state: z.string().min(2),

  latitude: z.number(),

  longitude: z.number(),

  totalArea: z.number().positive(),
});

export type CreateFarmDto = z.infer<
  typeof createFarmSchema
>;