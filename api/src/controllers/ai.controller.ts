import { Request, Response, NextFunction } from "express";
import * as aiService from "../services/ai.service";

export const analyzeProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await aiService.analyzeProduct(
      req.body.cropId,
      req.body.imageUrl
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeLeaf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await aiService.analyzeLeaf(
      req.body.cropId,
      req.body.imageUrl
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const generateWeeklyLogAdvice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const advice = await aiService.generateWeeklyLogAdvice(
      req.user!.id,
      req.params.weeklyLogId
    );

    return res.status(201).json({
      success: true,
      message: "Crop health advice generated successfully",
      data: advice,
    });
  } catch (error) {
    next(error);
  }
};

export const getWeeklyLogAdvice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adviceHistoryList = await aiService.getWeeklyLogAdvice(
      req.user!.id,
      req.params.weeklyLogId
    );

    return res.status(200).json({
      success: true,
      data: adviceHistoryList,
    });
  } catch (error) {
    next(error);
  }
};

export const generateWeeklyLogRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const advice = await aiService.generateWeeklyLogRecommendations(
      req.user!.id,
      req.params.weeklyLogId
    );

    return res.status(201).json({
      success: true,
      message: "Crop care recommendations generated successfully",
      data: advice,
    });
  } catch (error) {
    next(error);
  }
};

export const getWeeklyLogRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adviceHistoryList = await aiService.getWeeklyLogRecommendations(
      req.user!.id,
      req.params.weeklyLogId
    );

    return res.status(200).json({
      success: true,
      data: adviceHistoryList,
    });
  } catch (error) {
    next(error);
  }
};
