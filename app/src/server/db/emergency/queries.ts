import "server-only";
import { db } from "@/server/db";
import { devices, type emergencyStateEnum } from "@/server/db/devices/schema";
import { logInsert } from "@/server/db/logs/queries";
import { and, eq, sql } from "drizzle-orm";

export async function emergencyStateGetById(deviceId: string, ownerId: string) {
  return (
    await db
      .select({
        id: devices.id,
        emergencyState: devices.emergencyState,
      })
      .from(devices)
      .where(and(eq(devices.ownerId, ownerId), eq(devices.id, deviceId)))
      .limit(1)
  )[0];
}

export async function emergencyStateSetDevice(
  deviceId: string,
  state: (typeof emergencyStateEnum.enumValues)[number] | null,
  ownerId: string,
) {
  const device = (
    await db
      .update(devices)
      .set({
        emergencyState: state,
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(and(eq(devices.ownerId, ownerId), eq(devices.id, deviceId)))
      .returning({
        id: devices.id,
        serialId: devices.serialId,
        emergencyState: devices.emergencyState,
      })
  )[0];

  if (device) {
    const reference = [device.serialId, device.emergencyState ?? "clear"];
    void logInsert(
      ownerId,
      "device.emergency_state",
      ownerId,
      device.id,
      reference,
    );
  }

  return device;
}
