import axios from "axios";
import { eq, desc, and } from "drizzle-orm";
import { db } from "../config/database";
import {
  adviceHistory,
  aiAnalyses,
  weeklyLogs,
  crops,
} from "../models";
import { compileFullContext, verifyCropOwnership } from "./context.service";

// Helper to validate and unwrap FastAPI response
const unwrapResponse = (response: any) => {
  if (!response.data || response.data.success === false) {
    throw new Error(response.data?.error || "AI service returned a failure");
  }
  return response.data.data;
};

export const analyzeProduct = async (cropId: string, imageUrl: string) => {
  const response = await axios.post(
    `${process.env.AI_SERVICE_URL}/api/ai/analyze-product`,
    {
      imageUrl,
    }
  );

  const result = unwrapResponse(response);

  // Save to AI analysis history
  await db.insert(aiAnalyses).values({
    cropId,
    analysisType: "product",
    confidence: null,
    result,
    rawResponse: result,
  });

  return result;
};

export const analyzeLeaf = async (cropId: string, imageUrl: string) => {
  // Fetch crop details to get the cropName for knowledge injection
  const crop = await db.query.crops.findFirst({
    where: eq(crops.id, cropId),
  });
  const cropName = crop?.cropName || null;

  const response = await axios.post(
    `${process.env.AI_SERVICE_URL}/api/analyze-leaf`,
    {
      cropId,
      imageUrl,
      cropName,
    }
  );

  const result = unwrapResponse(response);

  // Save to AI analysis history
  await db.insert(aiAnalyses).values({
    cropId,
    analysisType: "leaf",
    confidence: typeof result.confidence === "number" ? result.confidence : null,
    result,
    rawResponse: result,
  });

  return result;
};

export const generateWeeklyLogAdvice = async (
  userId: number,
  weeklyLogId: string
) => {
  // 1. Compile full context using context builder layer
  const context = await compileFullContext(userId, weeklyLogId);

  // 2. Call FastAPI Crop Health endpoint
  const response = await axios.post(
    `${process.env.AI_SERVICE_URL}/api/crop-health`,
    context
  );

  const adviceResult = unwrapResponse(response);

  // 3. Save to advice history
  const [savedAdvice] = await db
    .insert(adviceHistory)
    .values({
      weeklyLogId,
      advice: JSON.stringify(adviceResult),
      riskLevel: adviceResult.diseaseRisk || null,
      generatedBy: "ai_health",
    })
    .returning();

  return savedAdvice;
};

export const getWeeklyLogAdvice = async (
  userId: number,
  weeklyLogId: string
) => {
  // 1. Fetch weekly log
  const log = await db.query.weeklyLogs.findFirst({
    where: eq(weeklyLogs.id, weeklyLogId),
  });
  if (!log) throw new Error("Weekly log not found");

  // 2. Verify crop ownership
  await verifyCropOwnership(userId, log.cropId);

  // 3. Fetch health advice history
  return db.query.adviceHistory.findMany({
    where: and(
      eq(adviceHistory.weeklyLogId, weeklyLogId),
      eq(adviceHistory.generatedBy, "ai_health")
    ),
    orderBy: [desc(adviceHistory.createdAt)],
  });
};

export const generateWeeklyLogRecommendations = async (
  userId: number,
  weeklyLogId: string
) => {
  // 1. Compile full context using context builder layer
  const context = await compileFullContext(userId, weeklyLogId);

  // 2. Call FastAPI recommendations endpoint
  const response = await axios.post(
    `${process.env.AI_SERVICE_URL}/api/recommendations`,
    context
  );

  const recResult = unwrapResponse(response);

  // 3. Save to advice history
  const [savedAdvice] = await db
    .insert(adviceHistory)
    .values({
      weeklyLogId,
      advice: JSON.stringify(recResult),
      riskLevel: recResult.diseaseRisk?.riskLevel || null,
      generatedBy: "ai_rec",
    })
    .returning();

  return savedAdvice;
};

export const getWeeklyLogRecommendations = async (
  userId: number,
  weeklyLogId: string
) => {
  // 1. Fetch weekly log
  const log = await db.query.weeklyLogs.findFirst({
    where: eq(weeklyLogs.id, weeklyLogId),
  });
  if (!log) throw new Error("Weekly log not found");

  // 2. Verify crop ownership
  await verifyCropOwnership(userId, log.cropId);

  // 3. Fetch recommendation advice history
  return db.query.adviceHistory.findMany({
    where: and(
      eq(adviceHistory.weeklyLogId, weeklyLogId),
      eq(adviceHistory.generatedBy, "ai_rec")
    ),
    orderBy: [desc(adviceHistory.createdAt)],
  });
};
