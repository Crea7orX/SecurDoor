import { getSortingStateParser } from "@/lib/data-table-parsers";
import { deviceStateResponseSchema } from "@/lib/validations/device-state";
import { emergencyStateEnum } from "@/server/db/devices/schema";
import {
  createSearchParamsCache,
  parseAsArrayOf,
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
    { id: "createdAt", desc: false },
  ]),
  name: parseAsString,
  emergencyState: parseAsArrayOf(z.enum(emergencyStateEnum.enumValues)),
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
  deviceIds: z.array(z.string()).min(1),
});

export type DeviceBulk = z.infer<typeof deviceBulkSchema>;
