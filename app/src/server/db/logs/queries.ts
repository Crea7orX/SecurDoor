import "server-only";

import { logResponseSchema, type LogsGetSchema } from "@/lib/validations/log";
import { db } from "@/server/db";
import { logs } from "@/server/db/logs/schema";
import { webhooksTrigger } from "@/server/db/webhooks/queries";
import { clerkClient } from "@clerk/nextjs/server";
import { and, asc, count, desc, eq, inArray } from "drizzle-orm";

export async function logInsert(
  ownerId: string,
  action: string,
  actorId: string,
  objectId?: string,
  reference?: object,
) {
  let actorName: string | undefined;
  let actorEmail: string | undefined;

  if (actorId.startsWith("user_")) {
    const user = await clerkClient.users.getUser(actorId);

    if (user) {
      actorName = `${user.firstName ?? ""}${user.lastName ? ` ${user.lastName}` : ""}`;
      actorEmail = user.primaryEmailAddress?.emailAddress;
    }
  }

  const log = (
    await db
      .insert(logs)
      .values({
        action,
        actorName,
        actorEmail,
        actorId,
        objectId: objectId,
        reference: reference,
        ownerId,
      })
      .returning()
  )[0];

  // Trigger webhooks
  void webhooksTrigger({ ownerId, logs: [logResponseSchema.parse(log)] });
}

export type LogsInsertMultipleData = {
  action: string;
  objectId?: string;
  reference?: object;
};

export async function logInsertMultiple(
  ownerId: string,
  logsData: LogsInsertMultipleData[],
  actorId: string,
) {
  let actorName: string | undefined;
  let actorEmail: string | undefined;

  if (actorId.startsWith("user_")) {
    const user = await clerkClient.users.getUser(actorId);
    if (user) {
      actorName = `${user.firstName ?? ""}${user.lastName ? ` ${user.lastName}` : ""}`;
      actorEmail = user.primaryEmailAddress?.emailAddress;
    }
  }

  // Prepare multiple values for bulk insert
  const values = logsData.map((log) => ({
    action: log.action,
    actorName,
    actorEmail,
    actorId,
    objectId: log.objectId,
    reference: log.reference,
    ownerId,
  }));

  // Insert all logs in one query
  const _logs = await db.insert(logs).values(values).returning();

  // Trigger webhooks
  void webhooksTrigger({
    ownerId,
    logs: _logs.map((log) => logResponseSchema.parse(log)),
  });
}

export async function logsGetAll(searchParams: LogsGetSchema, ownerId: string) {
  try {
    const offset = (searchParams.page - 1) * searchParams.perPage;

    const where = and(
      eq(logs.ownerId, ownerId), // Ensure ownership
      searchParams.action.length > 0
        ? inArray(logs.action, searchParams.action)
        : undefined,
      searchParams.objectId && searchParams.objectId.length > 0
        ? inArray(logs.objectId, searchParams.objectId)
        : undefined,
      searchParams.actorId.length > 0
        ? inArray(logs.actorId, searchParams.actorId)
        : undefined,
    );

    const orderBy =
      searchParams.sort.length > 0
        ? searchParams.sort.map((item) =>
            item.desc ? desc(logs[item.id]) : asc(logs[item.id]),
          )
        : [desc(logs.createdAt)];

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(logs)
        .limit(searchParams.perPage)
        .offset(offset)
        .where(where)
        .orderBy(...orderBy);

      const total = await tx
        .select({
          count: count(),
        })
        .from(logs)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0);

      return {
        data,
        total,
      };
    });

    const pageCount = Math.ceil(total / searchParams.perPage);
    return { data, pageCount };
  } catch {
    return { data: [], pageCount: 0 };
  }
}

export async function logGetById(id: string, ownerId: string) {
  return (
    (
      await db
        .select()
        .from(logs)
        .where(
          and(
            eq(logs.ownerId, ownerId), // Ensure ownership
            eq(logs.id, id),
          ),
        )
        .limit(1)
    )[0] ?? null
  );
}

export function logsActorsGetAll(ownerId: string) {
  return db
    .selectDistinctOn([logs.actorId], {
      actorId: logs.actorId,
      actorName: logs.actorName,
      actorEmail: logs.actorEmail,
    })
    .from(logs)
    .where(eq(logs.ownerId, ownerId))
    .orderBy(
      logs.actorId, // Required for DISTINCT ON
      desc(logs.createdAt), // Ensures newest log per actorId
      asc(logs.actorName), // Secondary sort of final result
    );
}
