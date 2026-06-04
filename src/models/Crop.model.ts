import {
  pgTable,
  uuid,
  varchar,
  date,
} from "drizzle-orm/pg-core";

import { farms } from "./Farm.model";

export const crops = pgTable("crops", {
  id: uuid("id").defaultRandom().primaryKey(),

  farmId: uuid("farm_id")
    .references(() => farms.id, {
      onDelete: "cascade",
    })
    .notNull(),

  cropName: varchar("crop_name", {
    length: 100,
  }).notNull(),

  soilType: varchar("soil_type", {
    length: 50,
  }),

  sowingDate: date("sowing_date")
    .notNull(),

  status: varchar("status", {
    length: 20,
  }).default("active"),
});