import {
  pgTable,
  uuid,
  decimal,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

import { weeklyLogs } from "./WeeklyLogs.model";

export const weatherSnapshots = pgTable(
  "weather_snapshots",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    weeklyLogId: uuid(
      "weekly_log_id"
    )
      .references(
        () => weeklyLogs.id,
        {
          onDelete: "cascade",
        }
      )
      .notNull(),

    temperature: decimal(
      "temperature",
      {
        precision: 5,
        scale: 2,
      }
    ),

    humidity: integer("humidity"),

    rainfall: decimal(
      "rainfall",
      {
        precision: 5,
        scale: 2,
      }
    ),

    windSpeed: decimal(
      "wind_speed",
      {
        precision: 5,
        scale: 2,
      }
    ),

    forecast: jsonb("forecast"),

    createdAt: timestamp(
      "created_at"
    )
      .defaultNow()
      .notNull(),
  }
);