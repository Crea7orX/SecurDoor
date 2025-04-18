import "server-only";

import { DeviceWithSameSerialIdError } from "@/lib/exceptions";
import { generateKey } from "@/lib/keys";
import { formatPublicKeyForDB } from "@/lib/signatures";
import {
  type DeviceCreate,
  type DevicesGetSchema,
  type DeviceUpdate,
} from "@/lib/validations/device";
import { db } from "@/server/db";
import {
  deviceStartAdoption,
  deviceStateInsert,
} from "@/server/db/devices-states/queries";
import { devicesStates } from "@/server/db/devices-states/schema";
import { devices } from "@/server/db/devices/schema";
import { logInsert } from "@/server/db/logs/queries";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNull,
  sql,
} from "drizzle-orm";

export async function deviceInsert(
  deviceCreate: DeviceCreate,
  userId: string,
  ownerId: string,
) {
  const deviceBySerialId = await deviceGetBySerialIdUnprotected(
    deviceCreate.serialId,
  );
  if (deviceBySerialId) {
    throw new DeviceWithSameSerialIdError(deviceBySerialId.id);
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
    await deviceStateInsert({ deviceId: device.id, ownerId }); // todo: transaction

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
      eq(devices.ownerId, ownerId), // Ensure ownership
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
        : [desc(devices.createdAt)];

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(devices)
        .leftJoin(devicesStates, eq(devices.id, devicesStates.deviceId))
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
        data: data.map((device) => ({
          ...device.devices,
          state: device.devices_states && {
            id: device.devices_states.deviceId,
            ...device.devices_states,
          },
        })),
        total,
      };
    });

    const pageCount = Math.ceil(total / searchParams.perPage);
    return {
      data,
      pageCount,
    };
  } catch {
    return { data: [], pageCount: 0 };
  }
}

export async function deviceGetById(id: string, ownerId: string) {
  const device = (
    await db
      .select()
      .from(devices)
      .leftJoin(devicesStates, eq(devices.id, devicesStates.deviceId))
      .where(and(eq(devices.ownerId, ownerId), eq(devices.id, id)))
      .limit(1)
  )[0];

  return device
    ? {
        ...device.devices,
        state: device.devices_states && {
          id: device.devices_states.deviceId,
          ...device.devices_states,
        },
      }
    : null;
}

export async function deviceGetBySerialIdUnprotected(serialId: string) {
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
      const reference = [device.serialId, device.name, device.reLockDelay];
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

export async function deviceSetPublicKeyBySerialId(
  serialId: string,
  publicKey: string,
) {
  const device = (
    await db
      .update(devices)
      .set({
        publicKey: formatPublicKeyForDB(publicKey),
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(
        and(
          eq(devices.serialId, serialId),
          isNull(devices.publicKey), // only set public key if it's not set yet
        ),
      )
      .returning()
  )[0];

  if (device) {
    await deviceStartAdoption({
      deviceId: device.id,
      ownerId: device.ownerId,
    });
  }

  return device;
}

interface DeviceSetLockedParams {
  id: string;
  userId: string;
  ownerId: string;
  isLocked: boolean;
}

export async function deviceSetLocked({
  id,
  userId,
  ownerId,
  isLocked,
}: DeviceSetLockedParams) {
  const device = (
    await db
      .update(devices)
      .set({
        isLocked: isLocked,
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(and(eq(devices.ownerId, ownerId), eq(devices.id, id)))
      .returning()
  )[0];

  if (device) {
    const reference = [device.serialId, device.name, "false"];
    void logInsert(
      ownerId,
      isLocked ? "device.lock" : "device.unlock",
      userId,
      device.id,
      reference,
    );
  }

  return device;
}
