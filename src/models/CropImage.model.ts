import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { weeklyLogs } from "./WeeklyLogs.model";

export const cropImages = pgTable(
  "crop_images",
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

    imageUrl: varchar(
      "image_url",
      {
        length: 500,
      }
    ).notNull(),

    imageType: varchar(
      "image_type",
      {
        length: 20,
      }
    ).notNull(),

    uploadedAt: timestamp(
      "uploaded_at"
    )
      .defaultNow()
      .notNull(),
  }
);