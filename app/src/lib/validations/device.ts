import { getSortingStateParser } from "@/lib/data-table-parsers";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
} from "nuqs/server";
import { z } from "zod";

export const deviceCreateSchema = z.object({
  name: z.string().min(2).max(256),
  serialId: z.string().uuid(),
});

export type DeviceCreate = z.infer<typeof deviceCreateSchema>;

export const deviceResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  serialId: z.string().uuid(),
  ownerId: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
});

export type DeviceResponse = z.infer<typeof deviceResponseSchema>;

export const deviceUpdateSchema = z.object({
  name: z.string().min(2).max(256).optional(),
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
  sort: getSortingStateParser<DeviceResponse>().withDefault([
    { id: "createdAt", desc: false },
  ]),
  name: parseAsString,
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
