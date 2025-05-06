import { getSortingStateParser } from "@/lib/data-table-parsers";
import { deviceStateResponseSchema } from "@/lib/validations/device-state";
import { tagResponseSchema } from "@/lib/validations/tag";
import {
  emergencyStateEnum,
  pendingCommandEnum,
} from "@/server/db/devices/schema";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
} from "nuqs/server";
import { z } from "zod";

export const deviceCreateSchema = z.object({
  name: z.string().min(2).max(256),
  serialId: z.string().uuid(),
  reLockDelay: z.number().min(0).max(120).optional(),
});

export type DeviceCreate = z.infer<typeof deviceCreateSchema>;

export const deviceResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  serialId: z.string().uuid(),
  reLockDelay: z.number(),
  isLocked: z.boolean(),
  emergencyState: z.enum(emergencyStateEnum.enumValues).nullable(),
  pendingCommand: z.enum(pendingCommandEnum.enumValues).nullable(),
  ownerId: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
  state: deviceStateResponseSchema.optional(),
});

export type DeviceResponse = z.infer<typeof deviceResponseSchema>;

export const deviceUpdateSchema = z.object({
  name: z.string().min(2).max(256).optional(),
  reLockDelay: z.number().min(0).max(120).optional(),
});

export type DeviceUpdate = z.infer<typeof deviceUpdateSchema>;

export const deviceGetKeySchema = z.object({
  id: z.string(),
});

export type DeviceGetKey = z.infer<typeof deviceGetKeySchema>;

export const deviceKeyResponseSchema = z.object({
  id: z.string(),
  key: z.string(),
});

export type DeviceKeyResponse = z.infer<typeof deviceKeyResponseSchema>;

export const devicesSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsNumberLiteral([10, 20, 30, 40, 50]).withDefault(10),
  sort: getSortingStateParser<Omit<DeviceResponse, "state">>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  name: parseAsString,
  isLockedState: parseAsArrayOf(parseAsBoolean),
  emergencyState: parseAsArrayOf(z.enum(emergencyStateEnum.enumValues)),
  tagId: parseAsArrayOf(parseAsString),
});

export type DevicesGetSchema = Awaited<
  ReturnType<typeof devicesSearchParamsCache.parse>
>;

export const devicesPaginatedResponseSchema = z.object({
  data: deviceResponseSchema.array(),
  pageCount: z.number(),
});

export type DevicesPaginatedResponse = z.infer<
  typeof devicesPaginatedResponseSchema
>;

export const deviceBulkSchema = z.object({
  deviceIds: z.array(z.string()),
});

export type DeviceBulk = z.infer<typeof deviceBulkSchema>;

export const deviceTagsResponseSchema = z.object({
  tags: z.array(
    tagResponseSchema.pick({
      id: true,
      name: true,
    }),
  ),
});

export type DeviceTagsResponse = z.infer<typeof deviceTagsResponseSchema>;

export const deviceTagsUpdateSchema = z.object({
  tags: z.string().array(),
});

export type DeviceTagsUpdate = z.infer<typeof deviceTagsUpdateSchema>;

export const deviceTagsUpdateResponseSchema = z.object({
  addedTags: z.string().array(),
  removedTags: z.string().array(),
});

export type DeviceTagsUpdateResponse = z.infer<
  typeof deviceTagsUpdateResponseSchema
>;

export const deviceSetPendingCommandSchema = z.object({
  pendingCommand: z.enum(pendingCommandEnum.enumValues).nullable(),
});

export type DeviceSetPendingCommand = z.infer<
  typeof deviceSetPendingCommandSchema
>;

export const deviceFilterExpandSchema = z.object({
  isLockedState: z.array(z.boolean()).optional(),
  tagId: z.array(z.string()).optional(),
});

export type DeviceFilterExpand = z.infer<typeof deviceFilterExpandSchema>;
