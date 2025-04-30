import "server-only";

import { WebhookTypeAlreadyExistsError } from "@/lib/exceptions";
import { type LogResponse } from "@/lib/validations/log";
import {
  type WebhookCreate,
  type WebhookUpdate,
} from "@/lib/validations/webhook";
import { triggerDiscordWebhook, triggerSlackWebhook } from "@/lib/webhooks";
import { db } from "@/server/db";
import { logInsert } from "@/server/db/logs/queries";
import { webhooks, webhookTypeEnum } from "@/server/db/webhooks/schema";
import { and, desc, eq, sql } from "drizzle-orm";

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
    const reference = [
      webhook.name,
      webhook.type,
      webhook.scope,
      webhook.enabled,
    ];
    void logInsert(ownerId, "webhook.create", userId, webhook.id, reference);

    // Test webhook
    void webhookTest({ ownerId, id: webhook.id });
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

interface WebhookUpdateProps {
  id: string;
  update: WebhookUpdate;
  userId: string;
  ownerId: string;
}

export async function webhookUpdate({
  id,
  update,
  userId,
  ownerId,
}: WebhookUpdateProps) {
  const webhook = (
    await db
      .update(webhooks)
      .set({
        ...(typeof update.name === "string" && {
          name: update.name.trim(),
        }),
        ...(typeof update.scope === "object" && {
          scope: update.scope,
        }),
        ...(typeof update.enabled === "boolean" && {
          enabled: update.enabled,
        }),
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(
        and(
          eq(webhooks.ownerId, ownerId), // Ensure ownership
          eq(webhooks.id, id),
        ),
      )
      .returning()
  )[0];

  if (webhook) {
    const reference = [
      webhook.name,
      webhook.type,
      webhook.scope,
      webhook.enabled,
    ];
    if (typeof update.name === "string") {
      void logInsert(ownerId, "webhook.rename", userId, webhook.id, reference);
    }

    if (typeof update.scope === "object") {
      void logInsert(
        ownerId,
        "webhook.scope_update",
        userId,
        webhook.id,
        reference,
      );
    }

    if (typeof update.enabled === "boolean") {
      void logInsert(
        ownerId,
        update.enabled ? "webhook.enable" : "webhook.disable",
        userId,
        webhook.id,
        reference,
      );
    }
  }

  return webhook;
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
    const reference = [
      webhook.name,
      webhook.type,
      webhook.scope,
      webhook.enabled,
    ];
    void logInsert(ownerId, "webhook.delete", userId, webhook.id, reference);
  }

  return webhook;
}

interface WebhookTestProps {
  id: string;
  ownerId: string;
}

export async function webhookTest({ id, ownerId }: WebhookTestProps) {
  const webhook = await webhookGetById({ id, ownerId });

  if (webhook) {
    await webhookTriggerByType({
      url: webhook.url,
      type: webhook.type,
      logsData: [],
      test: true,
    });
  }
}

interface WebhooksTriggerProps {
  ownerId: string;
  logs: LogResponse[];
}

export async function webhooksTrigger({ ownerId, logs }: WebhooksTriggerProps) {
  const webhooks = await webhooksGetAll({ ownerId });

  for (const webhook of webhooks) {
    if (!webhook.enabled) continue;

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
      await webhookTriggerByType({
        url: webhook.url,
        type: webhook.type,
        logsData: group,
      });
    }
  }
}

interface WebhookTriggerByTypeProps {
  url: string;
  type: string;
  logsData: LogResponse[];
  test?: boolean;
}

async function webhookTriggerByType({
  url,
  type,
  logsData,
  test = false,
}: WebhookTriggerByTypeProps) {
  // Discord
  if (type === webhookTypeEnum.enumValues[0]) {
    await triggerDiscordWebhook({
      url,
      logsData,
      test,
    });
  }
  // Slack
  else if (type === webhookTypeEnum.enumValues[1]) {
    await triggerSlackWebhook({
      url,
      logsData,
      test,
    });
  }
}
