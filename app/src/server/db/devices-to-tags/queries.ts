import "server-only";

import { ForbiddenError, NotFoundError } from "@/lib/exceptions";
import { db } from "@/server/db";
import { devicesToTags } from "@/server/db/devices-to-tags/schema";
import { deviceGetById } from "@/server/db/devices/queries";
import { devices } from "@/server/db/devices/schema";
import { logInsert } from "@/server/db/logs/queries";
import { tags } from "@/server/db/tags/schema";
import { and, asc, eq, inArray } from "drizzle-orm";

interface DeviceTagsGetAllProps {
  id: string;
  ownerId: string;
}

export function deviceTagsGetAll({ id, ownerId }: DeviceTagsGetAllProps) {
  return db
    .select({
      id: tags.id,
      name: tags.name,
    })
    .from(devicesToTags)
    .innerJoin(
      devices,
      and(
        eq(devices.ownerId, ownerId), // Ensure ownership
        eq(devices.id, id),
      ),
    )
    .innerJoin(
      tags,
      and(
        eq(tags.ownerId, ownerId), // Ensure ownership
        eq(tags.id, devicesToTags.tagId),
      ),
    ) // Join to get tag details
    .where(eq(devicesToTags.deviceId, id)) // Get tags only for the device
    .orderBy(asc(tags.name), asc(tags.createdAt));
}

interface DeviceTagsUpdateProps {
  id: string;
  tagIds: string[];
  userId: string;
  ownerId: string;
}

export async function deviceTagsUpdate({
  id,
  tagIds,
  userId,
  ownerId,
}: DeviceTagsUpdateProps) {
  // Ensure device ownership
  const device = await deviceGetById(id, ownerId);
  if (!device) {
    throw new NotFoundError();
  }

  // Remove duplicate tag IDs from input
  const uniqueTagIds = [...new Set(tagIds)];

  // Ensure provided tags ownership
  const ownedTags = await db
    .select({ id: tags.id })
    .from(tags)
    .where(and(eq(tags.ownerId, ownerId), inArray(tags.id, uniqueTagIds)));

  const ownedTagIds = ownedTags.map((card) => card.id);

  // Ensure requested tags ownership
  if (ownedTagIds.length !== uniqueTagIds.length) {
    throw new ForbiddenError();
  }

  // Fetch existing device-tag relationships
  const existingRelations = await db
    .select({ tagId: devicesToTags.tagId })
    .from(devicesToTags)
    .where(eq(devicesToTags.deviceId, id));

  const existingTagIds = existingRelations.map((tag) => tag.tagId);

  // Identify new tag associations to insert
  const newTagIds = ownedTagIds.filter(
    (tagId) => !existingTagIds.includes(tagId),
  );

  // Identify obsolete tag associations to delete
  const toDelete = existingTagIds.filter(
    (tagId) => !ownedTagIds.includes(tagId),
  );

  // Log for device with multiple tags (only if there are changes)
  if (newTagIds.length > 0 || toDelete.length > 0) {
    void logInsert(ownerId, "device.tags_update", userId, id, [
      device.serialId,
      device.name,
      [...newTagIds],
      [...toDelete],
    ]);
  }

  // Insert new associations
  if (newTagIds.length > 0) {
    await db.insert(devicesToTags).values(
      newTagIds.map((tagId) => ({
        deviceId: id,
        tagId,
      })),
    );
  }

  // Delete removed associations
  if (toDelete.length > 0) {
    await db
      .delete(devicesToTags)
      .where(
        and(
          eq(devicesToTags.deviceId, id),
          inArray(devicesToTags.tagId, toDelete),
        ),
      );
  }

  return [newTagIds, toDelete];
}
