import IdPrefix, { generateId } from "@/lib/ids";
import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const webhookTypeEnum = pgEnum("webhook_type", ["discord", "slack"]);

export const webhooks = pgTable("webhooks", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$default(() => generateId(IdPrefix.WEBHOOK)),
  name: varchar("name", { length: 256 }).notNull(),
  type: webhookTypeEnum("type").notNull(),
  url: text("url").notNull(),
  scope: text("scope")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  enabled: boolean("enabled").notNull().default(true),
  ownerId: varchar("owner_id", { length: 256 }).notNull(),
  createdAt: integer("created_at")
    .default(sql`(EXTRACT(EPOCH FROM NOW()))`)
    .notNull(),
  updatedAt: integer("updated_at").$onUpdate(
    () => sql`(EXTRACT(EPOCH FROM NOW()))`,
  ),
});
