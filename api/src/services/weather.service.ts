import axios from 'axios';
import { eq, and, desc } from 'drizzle-orm';

import { db } from '../config/database';

import { farms } from '../models/Farm.model';
import { weatherSnapshots } from '../models/WeatherSnapShot.model';

const fetchWeather = async (latitude: number, longitude: number) => {
    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
            latitude,
            longitude,
            current: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
        },
    });

    return data;
};

export const getFarmWeather = async (userId: number, farmId: string) => {
    const farm = await db.query.farms.findFirst({
        where: and(eq(farms.id, farmId), eq(farms.userId, userId)),
    });

    if (!farm) {
        throw new Error('Farm not found');
    }

    const weather = await fetchWeather(Number(farm.latitude), Number(farm.longitude));

    const current = weather.current;

    await db.insert(weatherSnapshots).values({
        farmId,

        temperature: current.temperature_2m,

        humidity: current.relative_humidity_2m,

        windSpeed: current.wind_speed_10m,

        rawData: weather,
    });

    return current;
};

export const getWeatherHistory = async (userId: number, farmId: string) => {
    const farm = await db.query.farms.findFirst({
        where: and(eq(farms.id, farmId), eq(farms.userId, userId)),
    });

    if (!farm) {
        throw new Error('Farm not found');
    }

    return db.query.weatherSnapshots.findMany({
        where: eq(weatherSnapshots.farmId, farmId),
        orderBy: [desc(weatherSnapshots.recordedAt)],
        limit: 30,
    });
};
