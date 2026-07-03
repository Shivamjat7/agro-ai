import {
    pgTable,
    uuid,
    integer,
    real,
    boolean,
    varchar,
    text,
    timestamp,
} from 'drizzle-orm/pg-core';

import { crops } from './Crop.model';

export const weeklyLogs = pgTable('weekly_logs', {
    id: uuid('id').defaultRandom().primaryKey(),

    cropId: uuid('crop_id')
        .references(() => crops.id, {
            onDelete: 'cascade',
        })
        .notNull(),

    weekNumber: integer('week_number').notNull(),

    plantHeight: real('plant_height'),

    leafColor: varchar('leaf_color', {
        length: 50,
    }),

    healthScore: integer('health_score'),

    irrigationDone: boolean('irrigation_done').default(false),

    fertilizerApplied: boolean('fertilizer_applied').default(false),

    pesticideApplied: boolean('pesticide_applied').default(false),

    farmerNotes: text('farmer_notes'),

    createdAt: timestamp('created_at').defaultNow().notNull(),

    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
