import "server-only";

import { ForbiddenError, NotFoundError } from "@/lib/exceptions";
import { db } from "@/server/db";
import { cardsToDevices } from "@/server/db/cards-to-devices/schema";
import { cardGetById } from "@/server/db/cards/queries";
import { cards } from "@/server/db/cards/schema";
import { deviceStateHeartbeatUpdate } from "@/server/db/devices-states/queries";
import {
  deviceGetById,
  type deviceGetBySerialIdUnprotected,
} from "@/server/db/devices/queries";
import { devices } from "@/server/db/devices/schema";
import {
  logInsert,
  logInsertMultiple,
  type LogsInsertMultipleData,
} from "@/server/db/logs/queries";
import { and, asc, eq, inArray, sql } from "drizzle-orm";

export function accessDeviceGetAll(deviceId: string, ownerId: string) {
  return db
    .select({
      id: cards.id,
      fingerprint: cards.fingerprint,
      holder: cards.holder,
    })
    .from(cardsToDevices)
    .innerJoin(
      devices,
      and(
        eq(devices.ownerId, ownerId), // Ensure ownership
        eq(devices.id, deviceId),
      ),
    )
    .innerJoin(
      cards,
      and(
        eq(cards.ownerId, ownerId), // Ensure ownership
        eq(cards.id, cardsToDevices.cardId),
      ),
    ) // Join to get card details
    .where(eq(cardsToDevices.deviceId, deviceId)) // Get cards only for the device
    .orderBy(asc(cards.holder), asc(cards.fingerprint), asc(cards.createdAt));
}

export async function accessDeviceUpdate(
  deviceId: string,
  cardIds: string[],
  userId: string,
  ownerId: string,
) {
  // Ensure device ownership
  const device = await deviceGetById(deviceId, ownerId);
  if (!device) {
    throw new NotFoundError();
  }

  // Remove duplicate card IDs from input
  const uniqueCardIds = [...new Set(cardIds)];

  // Ensure provided cards ownership
  const ownedCards = await db
    .select({ id: cards.id })
    .from(cards)
    .where(and(eq(cards.ownerId, ownerId), inArray(cards.id, uniqueCardIds)));

  const ownedCardIds = ownedCards.map((card) => card.id);

  // Ensure requested cards ownership
  if (ownedCardIds.length !== uniqueCardIds.length) {
    throw new ForbiddenError();
  }

  // Fetch existing card-device relationships
  const existingRelations = await db
    .select({ cardId: cardsToDevices.cardId })
    .from(cardsToDevices)
    .where(eq(cardsToDevices.deviceId, deviceId));

  const existingCardIds = existingRelations.map((card) => card.cardId);

  // Identify new card associations to insert
  const newCardIds = ownedCardIds.filter(
    (cardId) => !existingCardIds.includes(cardId),
  );

  // Identify obsolete card associations to delete
  const toDelete = existingCardIds.filter(
    (cardId) => !ownedCardIds.includes(cardId),
  );

  // Prepare logs
  const logs: LogsInsertMultipleData[] = [];

  // Log for device with multiple cards (only if there are changes)
  if (newCardIds.length > 0 || toDelete.length > 0) {
    logs.push({
      action: "device.access_update",
      objectId: deviceId,
      reference: [device.serialId, device.name, [...newCardIds], [...toDelete]],
    });
  }

  // Insert new associations
  if (newCardIds.length > 0) {
    await db.insert(cardsToDevices).values(
      newCardIds.map((cardId) => ({
        deviceId,
        cardId,
      })),
    );

    // Log for each card with the device
    newCardIds.forEach((id) => {
      const reference = [deviceId, device.serialId, device.name];
      logs.push({
        action: "card.add_device",
        objectId: id,
        reference,
      });
    });
  }

  // Delete removed associations
  if (toDelete.length > 0) {
    await db
      .delete(cardsToDevices)
      .where(
        and(
          eq(cardsToDevices.deviceId, deviceId),
          inArray(cardsToDevices.cardId, toDelete),
        ),
      );

    // Log for each card with the device
    toDelete.forEach((id) => {
      const reference = [deviceId, device.serialId, device.name];
      logs.push({
        action: "card.remove_device",
        objectId: id,
        reference,
      });
    });
  }

  // Insert logs
  if (logs.length > 0) {
    void logInsertMultiple(ownerId, logs, userId);
  }

  return [newCardIds, toDelete];
}

export async function accessCardGetAll(cardId: string, ownerId: string) {
  return db
    .select({
      id: devices.id,
      name: devices.name,
    })
    .from(cardsToDevices)
    .innerJoin(
      cards,
      and(
        eq(cards.ownerId, ownerId), // Ensure ownership
        eq(cards.id, cardId),
      ),
    )
    .innerJoin(
      devices,
      and(
        eq(devices.ownerId, ownerId), // Ensure ownership
        eq(devices.id, cardsToDevices.deviceId),
      ),
    ) // Join to get device details
    .where(eq(cardsToDevices.cardId, cardId)) // Get devices only for the card
    .orderBy(asc(devices.name), asc(devices.createdAt));
}

export async function accessCardUpdate(
  cardId: string,
  deviceIds: string[],
  userId: string,
  ownerId: string,
) {
  // Ensure card ownership
  const card = await cardGetById(cardId, ownerId);
  if (!card) {
    throw new NotFoundError();
  }

  // Remove duplicate device IDs from input
  const uniqueDeviceIds = [...new Set(deviceIds)];

  // Ensure provided devices ownership
  const ownedDevices = await db
    .select({ id: devices.id })
    .from(devices)
    .where(
      and(eq(devices.ownerId, ownerId), inArray(devices.id, uniqueDeviceIds)),
    );

  const ownedDeviceIds = ownedDevices.map((device) => device.id);

  // Ensure requested devices ownership
  if (ownedDeviceIds.length !== uniqueDeviceIds.length) {
    throw new ForbiddenError();
  }

  // Fetch existing card-device relationships
  const existingRelations = await db
    .select({ deviceId: cardsToDevices.deviceId })
    .from(cardsToDevices)
    .where(eq(cardsToDevices.cardId, cardId));

  const existingDeviceIds = existingRelations.map(
    (relation) => relation.deviceId,
  );

  // Identify new device associations to insert
  const newDeviceIds = ownedDeviceIds.filter(
    (deviceId) => !existingDeviceIds.includes(deviceId),
  );

  // Identify obsolete device associations to delete
  const toDelete = existingDeviceIds.filter(
    (deviceId) => !ownedDeviceIds.includes(deviceId),
  );

  // Prepare logs
  const logs: LogsInsertMultipleData[] = [];

  // Log for card with multiple devices (only if there are changes)
  if (newDeviceIds.length > 0 || toDelete.length > 0) {
    logs.push({
      action: "card.access_update",
      objectId: cardId,
      reference: [
        card.fingerprint,
        card.holder ?? "NULL",
        [...newDeviceIds],
        [...toDelete],
      ],
    });
  }

  // Insert new associations
  if (newDeviceIds.length > 0) {
    await db.insert(cardsToDevices).values(
      newDeviceIds.map((deviceId) => ({
        cardId,
        deviceId,
      })),
    );

    // Log for each device with the card
    newDeviceIds.forEach((id) => {
      logs.push({
        action: "device.add_card",
        objectId: id,
        reference: [cardId, card.fingerprint, card.holder ?? "NULL"],
      });
    });
  }

  // Delete removed associations
  if (toDelete.length > 0) {
    await db
      .delete(cardsToDevices)
      .where(
        and(
          eq(cardsToDevices.cardId, cardId),
          inArray(cardsToDevices.deviceId, toDelete),
        ),
      );

    // Log for each device with the card
    toDelete.forEach((id) => {
      logs.push({
        action: "device.remove_card",
        objectId: id,
        reference: [cardId, card.fingerprint, card.holder ?? "NULL"],
      });
    });
  }

  // Insert logs
  if (logs.length > 0) {
    void logInsertMultiple(ownerId, logs, userId);
  }

  return [newDeviceIds, toDelete];
}

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
