import { z } from "zod";

export const uploadImageSchema =
    z.object({
        cropId: z.string().uuid(),

        weeklyLogId: z
            .string()
            .uuid()
            .optional(),

        imageType: z.enum([
            "plant",
            "leaf",
            "soil",
            "field",
        ]),
    });