import { DeviceWithSameSerialIdError } from "@/lib/exceptions";
import IdPrefix, { generateId } from "@/lib/ids";
import { generateKey } from "@/lib/keys";
import { DeviceCreate } from "@/lib/validations/device";
import { db } from "@/server/db";
import { devices } from "@/server/db/devices/schema";
import { and, eq } from "drizzle-orm";

export async function deviceInsert(deviceCreate: DeviceCreate, userId: string) {
  if (await deviceGetBySerialId(deviceCreate.serialId)) {
    throw new DeviceWithSameSerialIdError();
  }

  return db
    .insert(devices)
    .values({
      id: generateId(IdPrefix.DEVICE),
      name: deviceCreate.name,
      serialId: deviceCreate.serialId,
      key: generateKey(),
      ownerId: userId,
    })
    .returning();
}

export function devicesGetAll(userId: string) {
  return db.select().from(devices).where(eq(devices.ownerId, userId));
}

export async function deviceGetById(id: string, userId: string) {
  return (
    (
      await db
        .select()
        .from(devices)
        .where(and(eq(devices.ownerId, userId), eq(devices.id, id)))
        .limit(1)
    )[0] ?? null
  );
}

export async function deviceGetBySerialId(serialId: string) {
  return (
    (
      await db
        .select()
        .from(devices)
        .where(eq(devices.serialId, serialId))
        .limit(1)
    )[0] ?? null
  );
}
