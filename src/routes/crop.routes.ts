import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware";

import {
    createCrop,
    getFarmCrops,
} from "../controllers/crop.controller";

const router = Router();

router.post(
    "/",
    authenticate,
    createCrop
);

router.get(
    "/farm/:farmId",
    authenticate,
    getFarmCrops
);

export default router;