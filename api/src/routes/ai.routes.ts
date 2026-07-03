import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { analyzeProductSchema, analyzeLeafSchema } from "../validators/ai.validator";
import {
  analyzeProduct,
  analyzeLeaf,
  generateWeeklyLogAdvice,
  getWeeklyLogAdvice,
  generateWeeklyLogRecommendations,
  getWeeklyLogRecommendations,
} from "../controllers/ai.controller";

const router = Router();

router.post(
  "/analyze-product",
  authenticate,
  validate(analyzeProductSchema),
  analyzeProduct
);

router.post(
  "/analyze-leaf",
  authenticate,
  validate(analyzeLeafSchema),
  analyzeLeaf
);

// Crop Health Engine advice history routes
router.post(
  "/weekly-logs/:weeklyLogId/advice",
  authenticate,
  generateWeeklyLogAdvice
);

router.get(
  "/weekly-logs/:weeklyLogId/advice",
  authenticate,
  getWeeklyLogAdvice
);

// Recommendation Engine advice history routes
router.post(
  "/weekly-logs/:weeklyLogId/recommendations",
  authenticate,
  generateWeeklyLogRecommendations
);

router.get(
  "/weekly-logs/:weeklyLogId/recommendations",
  authenticate,
  getWeeklyLogRecommendations
);

export default router;
