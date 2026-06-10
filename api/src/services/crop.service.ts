import { and, eq } from "drizzle-orm";

import { db } from "../config/database";
import { farms } from "../models/Farm.model";
import { crops } from "../models/Crop.model";

export const createCrop = async (
    userId: number,
    payload: {
        farmId: string;
        cropName: string;
        variety?: string;
        soilType?: string;
        sowingDate: string;
        expectedHarvestDate?: string;
    }
) => {
    const farm = await db.query.farms.findFirst({
        where: and(
            eq(farms.id, payload.farmId),
            eq(farms.userId, userId)
        ),
    });

    if (!farm) {
        throw new Error(
            "Farm not found or unauthorized"
        );
    }

    const [crop] = await db
        .insert(crops)
        .values({
            farmId: payload.farmId,
            cropName: payload.cropName,
            variety: payload.variety,
            soilType: payload.soilType,
            sowingDate: payload.sowingDate,
            expectedHarvestDate:
                payload.expectedHarvestDate,
        })
        .returning();

    return crop;
};


export const getFarmCrops = async (
    userId: number,
    farmId: string
) => {
    const farm = await db.query.farms.findFirst({
        where: and(
            eq(farms.id, farmId),
            eq(farms.userId, userId)
        ),
    });

    if (!farm) {
        throw new Error(
            "Farm not found or unauthorized"
        );
    }

    return db.query.crops.findMany({
        where: eq(crops.farmId, farmId),
    });
};

export const getCropById = async (
    userId: number,
    cropId: string
) => {
    const crop = await db.query.crops.findFirst({
        with: {
            farm: true,
        },
        where: eq(crops.id, cropId),
    });

    if (!crop) {
        throw new Error("Crop not found");
    }

    if (crop.farm.userId !== userId) {
        throw new Error("Unauthorized");
    }

    return crop;
};