import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

import { crops } from './Crop.model';
import { weeklyLogs } from './WeeklyLogs.model';

export const cropImages = pgTable('crop_images', {
    id: uuid('id').defaultRandom().primaryKey(),

    cropId: uuid('crop_id')
        .references(() => crops.id, {
            onDelete: 'cascade',
        })
        .notNull(),
    publicId: varchar('public_id', {
        length: 255,
    }).notNull(),
    weeklyLogId: uuid('weekly_log_id').references(() => weeklyLogs.id, {
        onDelete: 'cascade',
    }),

    imageUrl: varchar('image_url', {
        length: 500,
    }).notNull(),

    imageType: varchar('image_type', {
        length: 20,
    }).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
});
