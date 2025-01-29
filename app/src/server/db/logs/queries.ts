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
  let actorInfo = actor;
  if (actor.startsWith("user_")) {
    const user = await clerkClient.users.getUser(userId);

    if (user) {
      actorInfo = `${user.firstName ?? ""}${user.lastName ? ` ${user.lastName}` : ""}${user.primaryEmailAddress?.emailAddress ? ` (${user.primaryEmailAddress.emailAddress})` : ""}`;
    }
  }

  db.insert(logs)
    .values({
      id: generateId(IdPrefix.LOG),
      action,
      actor: actorInfo,
      objectId: objectId,
      reference: reference,
      ownerId: userId,
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function logsGetAll(input: LogsGetSchema, ownerId: string) {
  try {
    const offset = (input.page - 1) * input.perPage;

    const where = and(
      eq(logs.ownerId, ownerId), // Only show logs for the organization
      input.action.length > 0 ? inArray(logs.action, input.action) : undefined,
      input.actor.length > 0 ? inArray(logs.actor, input.actor) : undefined,
    );

    const orderBy =
      input.sort.length > 0
        ? input.sort.map((item) =>
            item.desc ? desc(logs[item.id]) : asc(logs[item.id]),
          )
        : [asc(logs.createdAt)];

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(logs)
        .limit(input.perPage)
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

    const pageCount = Math.ceil(total / input.perPage);
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
    .select({
      actor: logs.actor,
    })
    .from(logs)
    .where(eq(logs.ownerId, ownerId))
    .groupBy(logs.actor)
    .orderBy(asc(logs.actor));
}
