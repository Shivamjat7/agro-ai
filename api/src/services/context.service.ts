import { eq, desc, asc } from "drizzle-orm";
import { db } from "../config/database";
import {
  crops,
  farms,
  weeklyLogs,
  fertilizerLogs,
  MedicineLogs,
  weatherSnapshots,
  aiAnalyses,
} from "../models";

// Verify crop ownership helper
export const verifyCropOwnership = async (userId: number, cropId: string) => {
  const crop = await db
    .select({
      id: crops.id,
      farmUserId: farms.userId,
    })
    .from(crops)
    .innerJoin(farms, eq(crops.farmId, farms.id))
    .where(eq(crops.id, cropId))
    .then((res) => res[0]);

  if (!crop) {
    throw new Error("Crop not found");
  }

  if (crop.farmUserId !== userId) {
    throw new Error("Unauthorized");
  }
};

// 1. Crop Context Builder
export const buildCropContext = async (cropId: string) => {
  const crop = await db.query.crops.findFirst({
    where: eq(crops.id, cropId),
  });
  if (!crop) throw new Error("Crop not found");

  const sowingDateTime = new Date(crop.sowingDate).getTime();
  const daysSinceSowing = Math.floor((Date.now() - sowingDateTime) / (1000 * 60 * 60 * 24));

  return {
    cropName: crop.cropName,
    variety: crop.variety || "N/A",
    soilType: crop.soilType || "N/A",
    sowingDate: crop.sowingDate,
    status: crop.status,
    ageDays: daysSinceSowing,
  };
};

// 2. Timeline Builder (Growth Progress from Weekly Logs)
export const buildTimeline = async (cropId: string) => {
  const logs = await db.query.weeklyLogs.findMany({
    where: eq(weeklyLogs.cropId, cropId),
    orderBy: [asc(weeklyLogs.weekNumber)],
  });

  return logs.map((log, index) => {
    let plantHeightDelta = 0;
    if (index > 0 && log.plantHeight !== null && logs[index - 1].plantHeight !== null) {
      plantHeightDelta = Number((log.plantHeight - logs[index - 1].plantHeight!).toFixed(2));
    }

    return {
      weekNumber: log.weekNumber,
      plantHeight: log.plantHeight,
      plantHeightDelta,
      leafColor: log.leafColor || "N/A",
      healthScore: log.healthScore,
      irrigationDone: log.irrigationDone,
      fertilizerApplied: log.fertilizerApplied,
      pesticideApplied: log.pesticideApplied,
      farmerNotes: log.farmerNotes || "",
      createdAt: log.createdAt.toISOString(),
    };
  });
};

// 3. Weather Aggregator (aggregates snapshots over last 7 recordings)
export const buildWeatherSummary = async (farmId: string) => {
  const snapshots = await db.query.weatherSnapshots.findMany({
    where: eq(weatherSnapshots.farmId, farmId),
    orderBy: [desc(weatherSnapshots.recordedAt)],
    limit: 7,
  });

  if (!snapshots.length) {
    return {
      averageTemperature: null,
      averageHumidity: null,
      totalRainfall: 0,
      recentSnapshots: [],
    };
  }

  let tempSum = 0;
  let humiditySum = 0;
  let rainfallSum = 0;
  const count = snapshots.length;

  snapshots.forEach((s) => {
    tempSum += s.temperature || 0;
    humiditySum += s.humidity || 0;
    rainfallSum += s.rainfall || 0;
  });

  return {
    averageTemperature: Number((tempSum / count).toFixed(2)),
    averageHumidity: Number((humiditySum / count).toFixed(2)),
    totalRainfall: Number(rainfallSum.toFixed(2)),
    recentSnapshots: snapshots.map((s) => ({
      temperature: s.temperature,
      humidity: s.humidity,
      rainfall: s.rainfall,
      windSpeed: s.windSpeed,
      weatherCondition: s.weatherCondition || "N/A",
      recordedAt: s.recordedAt.toISOString(),
    })),
  };
};

// 4. History Aggregator (fertilizers, medicines, leaf analyses history)
export const buildHistoryContext = async (cropId: string) => {
  const fertilizers = await db.query.fertilizerLogs.findMany({
    where: eq(fertilizerLogs.cropId, cropId),
    orderBy: [desc(fertilizerLogs.appliedAt)],
  });

  const medicines = await db.query.MedicineLogs.findMany({
    where: eq(MedicineLogs.cropId, cropId),
    orderBy: [desc(MedicineLogs.appliedAt)],
  });

  const aiHistory = await db.query.aiAnalyses.findMany({
    where: eq(aiAnalyses.cropId, cropId),
    orderBy: [desc(aiAnalyses.createdAt)],
    limit: 5,
  });

  return {
    fertilizers: fertilizers.map((f) => ({
      productName: f.productName,
      quantity: f.quantity,
      unit: f.unit,
      applicationMethod: f.applicationMethod,
      aiExtractedData: f.aiExtractedData || {},
      appliedAt: f.appliedAt.toISOString(),
    })),
    medicines: medicines.map((m) => ({
      productName: m.productName,
      quantity: m.quantity,
      unit: m.unit,
      applicationMethod: m.applicationMethod,
      aiExtractedData: m.aiExtractedData || {},
      appliedAt: m.appliedAt.toISOString(),
    })),
    aiHistory: aiHistory.map((a) => ({
      analysisType: a.analysisType,
      confidence: a.confidence,
      result: a.result || {},
      createdAt: a.createdAt.toISOString(),
    })),
  };
};

// 5. Central Context Assembler
export const compileFullContext = async (userId: number, weeklyLogId: string) => {
  const log = await db.query.weeklyLogs.findFirst({
    where: eq(weeklyLogs.id, weeklyLogId),
  });
  if (!log) throw new Error("Weekly log not found");

  // Verify ownership
  await verifyCropOwnership(userId, log.cropId);

  const crop = await db.query.crops.findFirst({
    where: eq(crops.id, log.cropId),
  });
  if (!crop) throw new Error("Crop not found");

  const [cropContext, timeline, weatherSummary, historyContext] = await Promise.all([
    buildCropContext(log.cropId),
    buildTimeline(log.cropId),
    buildWeatherSummary(crop.farmId),
    buildHistoryContext(log.cropId),
  ]);

  return {
    crop: cropContext,
    weather: weatherSummary.recentSnapshots,
    weatherSummary: {
      averageTemperature: weatherSummary.averageTemperature,
      averageHumidity: weatherSummary.averageHumidity,
      totalRainfall: weatherSummary.totalRainfall,
    },
    weeklyLogs: timeline,
    fertilizers: historyContext.fertilizers,
    medicines: historyContext.medicines,
    aiHistory: historyContext.aiHistory,
  };
};
