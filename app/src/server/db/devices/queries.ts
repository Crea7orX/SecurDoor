import "server-only";

import { DeviceWithSameSerialIdError } from "@/lib/exceptions";
import { generateKey } from "@/lib/keys";
import {
  type DeviceCreate,
  type DevicesGetSchema,
  type DeviceUpdate,
} from "@/lib/validations/device";
import { db } from "@/server/db";
import { devices } from "@/server/db/devices/schema";
import { logInsert } from "@/server/db/logs/queries";
import { and, asc, count, desc, eq, ilike, inArray, sql } from "drizzle-orm";

export async function deviceInsert(
  deviceCreate: DeviceCreate,
  userId: string,
  ownerId: string,
) {
  if (await deviceGetBySerialId(deviceCreate.serialId)) {
    throw new DeviceWithSameSerialIdError();
  }

  const device = (
    await db
      .insert(devices)
      .values({
        name: deviceCreate.name,
        serialId: deviceCreate.serialId,
        key: generateKey(),
        reLockDelay: deviceCreate.reLockDelay,
        ownerId,
      })
      .returning()
  )[0];

  if (device) {
    const reference = [device.serialId, device.name];
    void logInsert(ownerId, "device.create", userId, device.id, reference);
  }

  return device;
}

export async function devicesGetAll(
  searchParams: DevicesGetSchema,
  ownerId: string,
) {
  try {
    const offset = (searchParams.page - 1) * searchParams.perPage;

    const where = and(
      eq(devices.ownerId, ownerId), // Only show devices for the organization
      searchParams.name && searchParams.name.trim() !== ""
        ? ilike(devices.name, `%${searchParams.name.trim()}%`)
        : undefined,
      searchParams.emergencyState && searchParams.emergencyState.length > 0
        ? inArray(devices.emergencyState, searchParams.emergencyState)
        : undefined,
    );

    const orderBy =
      searchParams.sort.length > 0
        ? searchParams.sort.map((item) =>
            item.desc ? desc(devices[item.id]) : asc(devices[item.id]),
          )
        : [asc(devices.createdAt)];

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(devices)
        .limit(searchParams.perPage)
        .offset(offset)
        .where(where)
        .orderBy(...orderBy);

      const total = await tx
        .select({
          count: count(),
        })
        .from(devices)
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

export async function deviceGetById(id: string, ownerId: string) {
  return (
    (
      await db
        .select()
        .from(devices)
        .where(and(eq(devices.ownerId, ownerId), eq(devices.id, id)))
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

export async function deviceUpdate(
  id: string,
  update: DeviceUpdate,
  userId: string,
  ownerId: string,
) {
  const device = (
    await db
      .update(devices)
      .set({
        ...(typeof update.name === "string" && {
          name: update.name.trim(),
        }),
        ...(typeof update.reLockDelay === "number" && {
          reLockDelay: update.reLockDelay,
        }),
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(and(eq(devices.ownerId, ownerId), eq(devices.id, id)))
      .returning()
  )[0];

  if (device) {
    if (typeof update.name === "string") {
      const reference = [device.serialId, device.name];
      void logInsert(ownerId, "device.rename", userId, device.id, reference);
    }

    if (typeof update.reLockDelay === "number") {
      const reference = [device.serialId, device.reLockDelay.toString()];
      void logInsert(
        ownerId,
        "device.re_lock_delay",
        userId,
        device.id,
        reference,
      );
    }
  }

  return device;
}

export async function deviceDelete(
  id: string,
  userId: string,
  ownerId: string,
) {
  const device = (
    await db
      .delete(devices)
      .where(and(eq(devices.ownerId, ownerId), eq(devices.id, id)))
      .returning()
  )[0];

  if (device) {
    const reference = [device.serialId, device.name];
    void logInsert(ownerId, "device.delete", userId, device.id, reference);
  }

  return device;
}
