import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
} from "drizzle-orm/pg-core";

import { crops } from "./Crop.model";

export const medicineLogs = pgTable(
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

    medicineName: varchar(
      "medicine_name",
      {
        length: 150,
      }
    ).notNull(),

    dosage: varchar("dosage", {
      length: 100,
    }),

    applicationMethod: varchar(
      "application_method",
      {
        length: 50,
      }
    ),

    appliedOn: date(
      "applied_on"
    ).notNull(),

    notes: text("notes"),
  }
);