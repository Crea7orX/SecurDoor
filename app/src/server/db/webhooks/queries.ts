import "server-only";

import { WebhookTypeAlreadyExistsError } from "@/lib/exceptions";
import { type WebhookCreate } from "@/lib/validations/webhook";
import { db } from "@/server/db";
import { logInsert } from "@/server/db/logs/queries";
import { and, desc, eq } from "drizzle-orm";
import { webhooks } from "./schema";

interface WebhookInsertProps {
  create: WebhookCreate;
  userId: string;
  ownerId: string;
}

export async function webhookInsert({
  create,
  userId,
  ownerId,
}: WebhookInsertProps) {
  // Check if the webhook type already exists for the owner
  const existingWebhook = (
    await db
      .select()
      .from(webhooks)
      .where(
        and(
          eq(webhooks.ownerId, ownerId), // Ensure ownership
          eq(webhooks.type, create.type), // Check for existing type
        ),
      )
      .limit(1)
  )[0];

  if (existingWebhook) {
    throw new WebhookTypeAlreadyExistsError();
  }

  const webhook = (
    await db
      .insert(webhooks)
      .values({
        name: create.name,
        type: create.type,
        url: create.url,
        ownerId,
      })
      .returning()
  )[0];

  if (webhook) {
    const reference = [webhook.name, webhook.type];
    void logInsert(ownerId, "webhook.create", userId, webhook.id, reference);
  }

  return webhook;
}

interface WebhooksGetAllProps {
  ownerId: string;
}

export async function webhooksGetAll({ ownerId }: WebhooksGetAllProps) {
  return db
    .select()
    .from(webhooks)
    .where(
      eq(webhooks.ownerId, ownerId), // Ensure ownership
    )
    .orderBy(desc(webhooks.type));
}

interface WebhookDeleteProps {
  id: string;
  userId: string;
  ownerId: string;
}

export async function webhookDelete({
  id,
  userId,
  ownerId,
}: WebhookDeleteProps) {
  const webhook = (
    await db
      .delete(webhooks)
      .where(
        and(
          eq(webhooks.ownerId, ownerId), // Ensure ownership
          eq(webhooks.id, id),
        ),
      )
      .returning()
  )[0];

  if (webhook) {
    const reference = [webhook.name, webhook.type];
    void logInsert(ownerId, "webhook.delete", userId, webhook.id, reference);
  }

  return webhook;
}
