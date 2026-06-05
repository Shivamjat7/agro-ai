import { eq, and } from "drizzle-orm";

import cloudinary from "../config/cloudinary";
import { db } from "../config/database";

import { farms } from "../models/Farm.model";
import { crops } from "../models/Crop.model";
import { cropImages } from "../models/CropImage.model";
import streamifier from "streamifier";

export const uploadToCloudinary = (
    buffer: Buffer
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream =
            cloudinary.uploader.upload_stream(
                {
                    folder: "agro-ai",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

        streamifier.createReadStream(buffer)
            .pipe(stream);
    });
};

export const uploadImage = async (
    userId: number,
    file: Express.Multer.File,
    payload: {
        cropId: string;
        imageType: string;
        weeklyLogId?: string;
    }
) => {
    const crop = await db
        .select({
            cropId: crops.id,
            farmUserId: farms.userId,
        })
        .from(crops)
        .innerJoin(
            farms,
            eq(crops.farmId, farms.id)
        )
        .where(eq(crops.id, payload.cropId));

    if (!crop.length) {
        throw new Error("Crop not found");
    }

    if (crop[0].farmUserId !== userId) {
        throw new Error("Unauthorized");
    }

    const uploaded =
        await uploadToCloudinary(
            file.buffer
        );

    const [image] = await db
        .insert(cropImages)
        .values({
            publicId: uploaded.public_id,
            cropId: payload.cropId,
            weeklyLogId:
                payload.weeklyLogId,
            imageUrl: uploaded.secure_url,
            imageType:
                payload.imageType,
        })
        .returning();

    return image;
};

export const getCropImages = async (
    cropId: string
) => {
    return db.query.cropImages.findMany({
        where: eq(
            cropImages.cropId,
            cropId
        ),
    });
};

export const getWeeklyLogImages = async (
    weeklyLogId: string
) => {
    return db.query.cropImages.findMany({
        where: eq(
            cropImages.weeklyLogId,
            weeklyLogId
        ),
    });
};