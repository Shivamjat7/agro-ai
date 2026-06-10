import {
    Request,
    Response,
    NextFunction,
} from "express";

import * as weeklyLogService from "../services/weekly-log.service";

export const createWeeklyLog = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const log =
            await weeklyLogService.createWeeklyLog(
                req.user!.id,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Weekly log created successfully",
            data: log,
        });
    } catch (error) {
        next(error);
    }
};

export const getCropLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const logs =
            await weeklyLogService.getCropLogs(
                req.user!.id,
                req.params.cropId
            );

        return res.status(200).json({
            success: true,
            data: logs,
        });
    } catch (error) {
        next(error);
    }
};