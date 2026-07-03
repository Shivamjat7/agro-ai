import { Request, Response, NextFunction } from 'express';
import * as farmService from '../services/farm.service';

export const createFarm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('req.user', req.user);
        const farm = await farmService.createFarm(req.user!.id, req.body);

        return res.status(201).json({
            success: true,
            message: 'Farm created successfully',
            data: farm,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllFarms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const farms = await farmService.getAllFarms(req.user!.id);

        return res.status(200).json({
            success: true,
            data: farms,
        });
    } catch (error) {
        next(error);
    }
};

export const getFarmById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const farm = await farmService.getFarmById(req.user!.id, req.params.id);

        return res.status(200).json({
            success: true,
            data: farm,
        });
    } catch (error) {
        next(error);
    }
};

export const updateFarm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const farm = await farmService.updateFarm(req.user!.id, req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: 'Farm updated successfully',
            data: farm,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteFarm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await farmService.deleteFarm(req.user!.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Farm deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
