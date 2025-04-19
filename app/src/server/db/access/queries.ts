import "server-only";

import { ForbiddenError } from "@/lib/exceptions";
import { db } from "@/server/db";
import { cardsToDevices } from "@/server/db/cards-to-devices/schema";
import { cards } from "@/server/db/cards/schema";
import { deviceStateHeartbeatUpdate } from "@/server/db/devices-states/queries";
import { type deviceGetBySerialIdUnprotected } from "@/server/db/devices/queries";
import { devices } from "@/server/db/devices/schema";
import { logInsert, logInsertMultiple } from "@/server/db/logs/queries";
import { and, eq, sql } from "drizzle-orm";

interface AccessCardTryAuthentication {
  ownerId: string;
  device: NonNullable<
    Awaited<ReturnType<typeof deviceGetBySerialIdUnprotected>>
  >;
  deviceId: string;
  fingerprint: string;
}

export async function accessCardTryAuthentication({
  ownerId,
  device,
  deviceId,
  fingerprint,
}: AccessCardTryAuthentication) {
  void deviceStateHeartbeatUpdate({ deviceId }); // update device heartbeat

  const access = (
    await db
      .select()
      .from(cardsToDevices)
      .innerJoin(
        cards,
        and(
          eq(cards.ownerId, ownerId), // Ensure ownership
          eq(cards.id, cardsToDevices.cardId),
        ),
      )
      .where(
        and(
          eq(cardsToDevices.deviceId, deviceId),
          eq(cards.fingerprint, fingerprint),
        ),
      )
  )[0];

  // no access given to the device
  if (!access) {
    const reference = [device.serialId, device.name, fingerprint];
    void logInsert(
      ownerId,
      "device.access_denied",
      "system",
      deviceId,
      reference,
    );

    throw new ForbiddenError();
  }

  // device in emergency state
  if (device.emergencyState) throw new ForbiddenError();

  // card is deactivated
  if (!access.cards.active) throw new ForbiddenError();

  // unlock
  if (device.isLocked) {
    await db
      .update(devices)
      .set({
        isLocked: false,
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(
        and(
          eq(devices.ownerId, ownerId), // Ensure ownership
          eq(devices.id, deviceId),
        ),
      );

    // log
    const logs = [
      {
        action: "device.unlock",
        objectId: deviceId,
        reference: [
          device.serialId,
          device.name,
          "true",
          access.cards.fingerprint,
          access.cards.holder ?? "NULL",
        ],
      },
      {
        action: "card.unlock",
        objectId: access.cards.id,
        reference: [
          access.cards.fingerprint,
          access.cards.holder ?? "NULL",
          device.serialId,
          device.name,
        ],
      },
    ];
    void logInsertMultiple(ownerId, logs, "system");
  }
  // lock
  else {
    await db
      .update(devices)
      .set({
        isLocked: true,
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(
        and(
          eq(devices.ownerId, ownerId), // Ensure ownership
          eq(devices.id, deviceId),
        ),
      );

    // log
    const logs = [
      {
        action: "device.lock",
        objectId: deviceId,
        reference: [
          device.serialId,
          device.name,
          "true",
          access.cards.fingerprint,
          access.cards.holder ?? "NULL",
        ],
      },
      {
        action: "card.lock",
        objectId: access.cards.id,
        reference: [
          access.cards.fingerprint,
          access.cards.holder ?? "NULL",
          device.serialId,
          device.name,
        ],
      },
    ];
    void logInsertMultiple(ownerId, logs, "system");
  }

  return {
    isLocked: !device.isLocked,
    reLockDelay: device.reLockDelay,
    holder: access.cards.holder,
  };
}
