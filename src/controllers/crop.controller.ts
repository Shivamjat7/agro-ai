import { Request, Response, NextFunction } from "express";

import * as cropService from "../services/crop.service";

export const createCrop = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const crop =
            await cropService.createCrop(
                req.user!.id,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Crop created successfully",
            data: crop,
        });
    } catch (error) {
        next(error);
    }
};

export const getFarmCrops = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const crops =
            await cropService.getFarmCrops(
                req.user!.id,
                req.params.farmId
            );

        return res.status(200).json({
            success: true,
            data: crops,
        });
    } catch (error) {
        next(error);
    }
};