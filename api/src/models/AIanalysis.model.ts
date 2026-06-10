import {
  pgTable,
  uuid,
  varchar,
  real,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

import { crops } from "./Crop.model";

export const aiAnalyses = pgTable(
  "ai_analyses",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    cropId: uuid("crop_id")
      .references(() => crops.id, {
        onDelete: "cascade",
      })
      .notNull(),

    analysisType: varchar(
      "analysis_type",
      {
        length: 50,
      }
    ).notNull(),

    confidence: real(
      "confidence"
    ),

    result: jsonb("result"),

    rawResponse: jsonb(
      "raw_response"
    ),

    createdAt: timestamp(
      "created_at"
    )
      .defaultNow()
      .notNull(),
  }
);