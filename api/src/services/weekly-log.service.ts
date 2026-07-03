import { and, eq } from 'drizzle-orm';

import { db } from '../config/database';

import { farms } from '../models/Farm.model';
import { crops } from '../models/Crop.model';
import { weeklyLogs } from '../models/WeeklyLogs.model';

export const createWeeklyLog = async (userId: number, payload: any) => {
    const crop = await db
        .select({
            cropId: crops.id,
            farmUserId: farms.userId,
        })
        .from(crops)
        .innerJoin(farms, eq(crops.farmId, farms.id))
        .where(eq(crops.id, payload.cropId));

    if (!crop.length) {
        throw new Error('Crop not found');
    }

    if (crop[0].farmUserId !== userId) {
        throw new Error('Unauthorized');
    }

    const [log] = await db.insert(weeklyLogs).values(payload).returning();

    return log;
};

export const getCropLogs = async (userId: number, cropId: string) => {
    const crop = await db
        .select({
            cropId: crops.id,
            farmUserId: farms.userId,
        })
        .from(crops)
        .innerJoin(farms, eq(crops.farmId, farms.id))
        .where(eq(crops.id, cropId));

    if (!crop.length) {
        throw new Error('Crop not found');
    }

    if (crop[0].farmUserId !== userId) {
        throw new Error('Unauthorized');
    }

    return db.query.weeklyLogs.findMany({
        where: eq(weeklyLogs.cropId, cropId),
    });
};
