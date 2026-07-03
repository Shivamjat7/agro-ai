import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { crops, farms, fertilizerLogs, MedicineLogs } from '../models';
import { uploadToCloudinary } from './image.service';
import * as aiService from './ai.service';

// Verify crop ownership helper
const verifyCropOwnership = async (userId: number, cropId: string) => {
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
};

export const createFertilizerLog = async (
    userId: number,
    file: Express.Multer.File,
    payload: {
        cropId: string;
        quantity?: number;
        unit?: string;
        applicationMethod?: string;
        notes?: string;
        appliedAt?: string;
    }
) => {
    await verifyCropOwnership(userId, payload.cropId);

    // Upload image to Cloudinary
    const uploaded = await uploadToCloudinary(file.buffer);
    const imageUrl = uploaded.secure_url;

    // Run AI product analysis on the uploaded image URL
    const aiResult = await aiService.analyzeProduct(payload.cropId, imageUrl);

    // Determine product name from AI extraction or fallback
    const productName = aiResult.productName || 'AI Extracted Fertilizer';

    // Create log in db
    const [log] = await db
        .insert(fertilizerLogs)
        .values({
            cropId: payload.cropId,
            imageUrl,
            productName,
            quantity: payload.quantity ? Number(payload.quantity) : null,
            unit: payload.unit || null,
            applicationMethod: payload.applicationMethod || null,
            aiExtractedData: aiResult,
            notes: payload.notes || null,
            appliedAt: payload.appliedAt ? new Date(payload.appliedAt) : new Date(),
        })
        .returning();

    return log;
};

export const getFertilizerLogs = async (userId: number, cropId: string) => {
    await verifyCropOwnership(userId, cropId);

    return db.query.fertilizerLogs.findMany({
        where: eq(fertilizerLogs.cropId, cropId),
    });
};

export const createMedicineLog = async (
    userId: number,
    file: Express.Multer.File,
    payload: {
        cropId: string;
        quantity?: number;
        unit?: string;
        applicationMethod?: string;
        notes?: string;
        appliedAt?: string;
    }
) => {
    await verifyCropOwnership(userId, payload.cropId);

    // Upload image to Cloudinary
    const uploaded = await uploadToCloudinary(file.buffer);
    const imageUrl = uploaded.secure_url;

    // Run AI product analysis
    const aiResult = await aiService.analyzeProduct(payload.cropId, imageUrl);

    const productName = aiResult.productName || 'AI Extracted Medicine';

    // Create log in db
    const [log] = await db
        .insert(MedicineLogs)
        .values({
            cropId: payload.cropId,
            imageUrl,
            productName,
            quantity: payload.quantity ? Number(payload.quantity) : null,
            unit: payload.unit || null,
            applicationMethod: payload.applicationMethod || null,
            aiExtractedData: aiResult,
            notes: payload.notes || null,
            appliedAt: payload.appliedAt ? new Date(payload.appliedAt) : new Date(),
        })
        .returning();

    return log;
};

export const getMedicineLogs = async (userId: number, cropId: string) => {
    await verifyCropOwnership(userId, cropId);

    return db.query.MedicineLogs.findMany({
        where: eq(MedicineLogs.cropId, cropId),
    });
};
