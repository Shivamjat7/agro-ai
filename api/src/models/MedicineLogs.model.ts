import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  real
} from "drizzle-orm/pg-core";

import { crops } from "./Crop.model";


export const MedicineLogs = pgTable(
  "medicine_logs",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    cropId: uuid("crop_id")
      .references(() => crops.id, {
        onDelete: "cascade",
      })
      .notNull(),

    imageUrl: varchar("image_url", {
      length: 500,
    }),

    productName: varchar("product_name", {
      length: 255,
    }),

    quantity: real("quantity"),

    unit: varchar("unit", {
      length: 20,
    }),

    applicationMethod: varchar(
      "application_method",
      {
        length: 50,
      }
    ),

    details: text("details"),

    aiExtractedData: jsonb(
      "ai_extracted_data"
    ),

    notes: text("notes"),

    appliedAt: timestamp(
      "applied_at"
    )
      .defaultNow()
      .notNull(),

    createdAt: timestamp(
      "created_at"
    )
      .defaultNow()
      .notNull(),
  }
);