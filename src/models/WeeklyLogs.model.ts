import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { crops } from "./Crop.model";

export const weeklyLogs = pgTable(
  "weekly_logs",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    cropId: uuid("crop_id")
      .references(() => crops.id, {
        onDelete: "cascade",
      })
      .notNull(),

    weekNumber: integer("week_number")
      .notNull(),

    growthStage: varchar(
      "growth_stage",
      {
        length: 100,
      }
    ),

    notes: text("notes"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  }
);