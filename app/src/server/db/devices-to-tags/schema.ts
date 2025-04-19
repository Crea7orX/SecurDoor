import { devices } from "@/server/db/devices/schema";
import { tags } from "@/server/db/tags/schema";
import { sql } from "drizzle-orm";
import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

export const devicesToTags = pgTable(
  "devices_to_tags",
  {
    deviceId: varchar("device_id", { length: 256 })
      .notNull()
      .references(() => devices.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    tagId: varchar("tag_id", { length: 256 })
      .notNull()
      .references(() => tags.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    createdAt: integer("created_at")
      .default(sql`(EXTRACT(EPOCH FROM NOW()))`)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.deviceId, table.tagId] }),
  }),
);
