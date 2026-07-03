import { Request, Response, NextFunction } from 'express';
import * as logService from '../services/log.service';

export const createFertilizerLog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const log = await logService.createFertilizerLog(req.user!.id, req.file!, {
            cropId: req.params.cropId,
            ...req.body,
        });

        return res.status(201).json({
            success: true,
            message: 'Fertilizer log created successfully',
            data: log,
        });
    } catch (error) {
        next(error);
    }
};

export const getFertilizerLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logs = await logService.getFertilizerLogs(req.user!.id, req.params.cropId);

        return res.status(200).json({
            success: true,
            data: logs,
        });
    } catch (error) {
        next(error);
    }
};

export const createMedicineLog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const log = await logService.createMedicineLog(req.user!.id, req.file!, {
            cropId: req.params.cropId,
            ...req.body,
        });

        return res.status(201).json({
            success: true,
            message: 'Medicine log created successfully',
            data: log,
        });
    } catch (error) {
        next(error);
    }
};

export const getMedicineLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logs = await logService.getMedicineLogs(req.user!.id, req.params.cropId);

        return res.status(200).json({
            success: true,
            data: logs,
        });
    } catch (error) {
        next(error);
    }
};
