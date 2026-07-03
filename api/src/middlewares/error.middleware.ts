import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
    });

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};
