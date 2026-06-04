import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
} from "drizzle-orm/pg-core";

import { crops } from "./Crop.model";

export const fertilizerLogs = pgTable(
  "fertilizer_logs",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    cropId: uuid("crop_id")
      .references(() => crops.id, {
        onDelete: "cascade",
      })
      .notNull(),

    fertilizerName: varchar(
      "fertilizer_name",
      {
        length: 150,
      }
    ).notNull(),

    quantity: varchar(
      "quantity",
      {
        length: 100,
      }
    ),

    appliedOn: date(
      "applied_on"
    ).notNull(),

    notes: text("notes"),
  }
);