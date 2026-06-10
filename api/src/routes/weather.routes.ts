import { Router } from "express";

import { authenticate }
from "../middlewares/auth.middleware";

import {
    getFarmWeather,
    getWeatherHistory,
} from "../controllers/weather.controller";

const router = Router();

router.get(
    "/farm/:farmId",
    authenticate,
    getFarmWeather
);

router.get(
    "/history/:farmId",
    authenticate,
    getWeatherHistory
);

export default router;