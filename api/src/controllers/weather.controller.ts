import { Request, Response, NextFunction } from 'express';

import * as weatherService from '../services/weather.service';
export const getFarmWeather = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const weather = await weatherService.getFarmWeather(req.user!.id, req.params.farmId);

        return res.json({
            success: true,
            data: weather,
        });
    } catch (error) {
        next(error);
    }
};
export const getWeatherHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const history = await weatherService.getWeatherHistory(req.user!.id, req.params.farmId);

        return res.json({
            success: true,
            data: history,
        });
    } catch (error) {
        next(error);
    }
};
