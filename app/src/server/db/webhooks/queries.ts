import "server-only";

import { WebhookTypeAlreadyExistsError } from "@/lib/exceptions";
import { type LogResponse } from "@/lib/validations/log";
import { type WebhookCreate } from "@/lib/validations/webhook";
import { triggerDiscordWebhook, triggerSlackWebhook } from "@/lib/webhooks";
import { db } from "@/server/db";
import { logInsert } from "@/server/db/logs/queries";
import { webhooks, webhookTypeEnum } from "@/server/db/webhooks/schema";
import { and, desc, eq } from "drizzle-orm";

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
        scope: create.scope,
        ownerId,
      })
      .returning()
  )[0];

  if (webhook) {
    const reference = [webhook.name, webhook.type, webhook.scope];
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

interface WebhookGetByIdProps {
  id: string;
  ownerId: string;
}

export async function webhookGetById({ id, ownerId }: WebhookGetByIdProps) {
  return (
    (
      await db
        .select()
        .from(webhooks)
        .where(
          and(
            eq(webhooks.ownerId, ownerId), // Ensure ownership
            eq(webhooks.id, id),
          ),
        )
        .limit(1)
    )[0] ?? null
  );
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
    const reference = [webhook.name, webhook.type, webhook.scope];
    void logInsert(ownerId, "webhook.delete", userId, webhook.id, reference);
  }

  return webhook;
}

interface WebhooksTriggerProps {
  ownerId: string;
  logs: LogResponse[];
}

export async function webhooksTrigger({ ownerId, logs }: WebhooksTriggerProps) {
  const webhooks = await webhooksGetAll({ ownerId });

  for (const webhook of webhooks) {
    // Filter logs by scope and split to groups of 10
    const groups = logs
      .filter((log) => webhook.scope.includes(log.action))
      .reduce((acc, log, index) => {
        if (index % 10 === 0) {
          acc.push([]);
        }
        const lastGroup = acc[acc.length - 1];
        if (lastGroup) {
          lastGroup.push(log);
        }
        return acc;
      }, [] as LogResponse[][]);

    // Trigger webhooks
    for (const group of groups) {
      // Discord
      if (webhook.type === webhookTypeEnum.enumValues[0]) {
        await triggerDiscordWebhook({
          url: webhook.url,
          logsData: group,
        });
      }
      // Slack
      else if (webhook.type === webhookTypeEnum.enumValues[1]) {
        await triggerSlackWebhook({
          url: webhook.url,
          logsData: group,
        });
      }
    }
  }
}
