import {
    Request,
    Response,
    NextFunction,
} from "express";

import * as imageService from "../services/image.service";

export const uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const image =
            await imageService.uploadImage(
                req.user!.id,
                req.file!,
                req.body
            );

        return res.status(201).json({
            success: true,
            data: image,
        });
    } catch (error) {
        next(error);
    }
};

export const getCropImages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const images =
            await imageService.getCropImages(
                req.params.cropId
            );

        return res.status(200).json({
            success: true,
            data: images,
        });
    } catch (error) {
        next(error);
    }
};

export const getWeeklyLogImages =
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const images =
                await imageService.getWeeklyLogImages(
                    req.params.weeklyLogId
                );

            return res.status(200).json({
                success: true,
                data: images,
            });
        } catch (error) {
            next(error);
        }
    };