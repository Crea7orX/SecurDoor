import { devices } from "@/server/db/devices/schema";
import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";

export const deviceStatusEnum = pgEnum("device_status", [
  "pending_adoption",
  "adopting",
  "adopted",
]);

export const devicesStates = pgTable("devices_states", {
  deviceId: varchar("device_id", { length: 256 })
    .primaryKey()
    .notNull()
    .references(() => devices.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  status: deviceStatusEnum("status").notNull().default("pending_adoption"),
  isLocked: boolean("is_locked").notNull().default(true),
  updatedAt: integer("updated_at")
    .default(sql`(EXTRACT(EPOCH FROM NOW()))`)
    .notNull(),
});
