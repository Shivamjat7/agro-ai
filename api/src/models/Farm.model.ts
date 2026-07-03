import { pgTable, uuid, varchar, real, timestamp, index, integer } from 'drizzle-orm/pg-core';

import { users } from './User.model';

export const farms = pgTable(
    'farms',
    {
        id: uuid('id').defaultRandom().primaryKey(),

        userId: integer('user_id')
            .references(() => users.id, {
                onDelete: 'cascade',
            })
            .notNull(),

        farmName: varchar('farm_name', {
            length: 100,
        }).notNull(),

        village: varchar('village', {
            length: 100,
        }).notNull(),

        state: varchar('state', {
            length: 100,
        }).notNull(),

        latitude: real('latitude').notNull(),

        longitude: real('longitude').notNull(),

        totalArea: real('total_area'),

        createdAt: timestamp('created_at').defaultNow().notNull(),

        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),

        deletedAt: timestamp('deleted_at'),
    },
    table => ({
        userIdx: index('farm_user_idx').on(table.userId),
    })
);
