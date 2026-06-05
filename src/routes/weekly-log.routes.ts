import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware";

import {
    createWeeklyLog,
    getCropLogs,
} from "../controllers/weekly-log.controller";

const router = Router();

router.post(
    "/",
    authenticate,
    createWeeklyLog
);

router.get(
    "/crop/:cropId",
    authenticate,
    getCropLogs
);

export default router;