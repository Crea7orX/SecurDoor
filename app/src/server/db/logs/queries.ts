import "server-only";
import IdPrefix, { generateId } from "@/lib/ids";
import { type LogsGetSchema } from "@/lib/validations/log";
import { db } from "@/server/db";
import { logs } from "@/server/db/logs/schema";
import { clerkClient } from "@clerk/nextjs/server";
import { and, asc, count, desc, eq, inArray } from "drizzle-orm";

export async function logInsert(
  userId: string,
  action: string,
  actor: string,
  objectId?: string,
  reference?: string[],
) {
  let actorName;
  let actorEmail;
  if (actor.startsWith("user_")) {
    const user = await clerkClient.users.getUser(userId);

    if (user) {
      actorName = `${user.firstName ?? ""}${user.lastName ? ` ${user.lastName}` : ""}`;
      actorEmail = user.primaryEmailAddress?.emailAddress;
    }
  }

  db.insert(logs)
    .values({
      id: generateId(IdPrefix.LOG),
      action,
      actorName,
      actorEmail,
      actorId: actor,
      objectId: objectId,
      reference: reference,
      ownerId: userId,
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function logsGetAll(searchParams: LogsGetSchema, ownerId: string) {
  try {
    const offset = (searchParams.page - 1) * searchParams.perPage;

    const where = and(
      eq(logs.ownerId, ownerId), // Only show logs for the organization
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
        : [asc(logs.createdAt)];

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
  } catch (error) {
    return { data: [], pageCount: 0 };
  }
}

export async function logGetById(id: string, ownerId: string) {
  return (
    (
      await db
        .select()
        .from(logs)
        .where(and(eq(logs.ownerId, ownerId), eq(logs.id, id)))
        .limit(1)
    )[0] ?? null
  );
}

export function logsActorsGetAll(ownerId: string) {
  return db
    .selectDistinctOn([logs.actorName, logs.actorId], {
      actorName: logs.actorName,
      actorEmail: logs.actorEmail,
      actorId: logs.actorId,
    })
    .from(logs)
    .where(eq(logs.ownerId, ownerId))
    .orderBy(asc(logs.actorName), asc(logs.actorId));
}
