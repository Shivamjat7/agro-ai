import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { weeklyLogs } from "./WeeklyLogs.model";

export const adviceHistory = pgTable(
  "advice_history",
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

    advice: text("advice")
      .notNull(),

    riskLevel: varchar(
      "risk_level",
      {
        length: 20,
      }
    ),

    generatedBy: varchar(
      "generated_by",
      {
        length: 20,
      }
    ).default("ai"),

    createdAt: timestamp(
      "created_at"
    )
      .defaultNow()
      .notNull(),
  }
);