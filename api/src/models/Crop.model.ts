import {
  pgTable,
  uuid,
  varchar,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

import { farms } from './Farm.model';
export const crops = pgTable("crops", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  farmId: uuid("farm_id")
    .references(() => farms.id, {
      onDelete: "cascade",
    })
    .notNull(),

  cropName: varchar("crop_name", {
    length: 100,
  }).notNull(),

  variety: varchar("variety", {
    length: 100,
  }),

  soilType: varchar("soil_type", {
    length: 50,
  }),

  sowingDate: date("sowing_date")
    .notNull(),

  expectedHarvestDate: date(
    "expected_harvest_date"
  ),

  status: varchar("status", {
    length: 20,
  })
    .default("active")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});