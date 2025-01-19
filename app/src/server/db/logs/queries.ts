import "server-only";
import IdPrefix, { generateId } from "@/lib/ids";
import { db } from "@/server/db";
import { logs } from "@/server/db/logs/schema";
import { clerkClient } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";

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

export function logsGetAll(ownerId: string) {
  return db
    .select()
    .from(logs)
    .orderBy(desc(logs.createdAt))
    .where(eq(logs.ownerId, ownerId));
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
