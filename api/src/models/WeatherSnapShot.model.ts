import { pgTable, uuid, real, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';

import { farms } from './Farm.model';

export const weatherSnapshots = pgTable('weather_snapshots', {
    id: uuid('id').defaultRandom().primaryKey(),

    farmId: uuid('farm_id')
        .references(() => farms.id, {
            onDelete: 'cascade',
        })
        .notNull(),

    temperature: real('temperature'),

    humidity: real('humidity'),

    rainfall: real('rainfall'),

    windSpeed: real('wind_speed'),

    weatherCondition: varchar('weather_condition', {
        length: 100,
    }),

    rawData: jsonb('raw_data'),

    recordedAt: timestamp('recorded_at').defaultNow().notNull(),
});
