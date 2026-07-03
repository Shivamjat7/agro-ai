import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const cropTypes = pgTable('crop_types', {
    id: uuid('id').defaultRandom().primaryKey(),

    name: varchar('name', {
        length: 100,
    })
        .notNull()
        .unique(),
});
