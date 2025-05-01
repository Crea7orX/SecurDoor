import { getSortingStateParser } from "@/lib/data-table-parsers";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
} from "nuqs/server";
import { z } from "zod";

export const biometricCreateSchema = z.object({
  biometricId: z.number().min(0).max(127),
  individual: z.string().min(2).max(256).optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export type BiometricCreate = z.infer<typeof biometricCreateSchema>;

export const biometricResponseSchema = z.object({
  id: z.string(),
  biometricId: z.number(),
  individual: z.string().optional().nullable(),
  active: z.boolean(),
  deviceId: z.string(),
  ownerId: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
});

export type BiometricResponse = z.infer<typeof biometricResponseSchema>;

export const biometricUpdateSchema = z.object({
  individual: z.string().min(2).max(256).optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export type BiometricUpdate = z.infer<typeof biometricUpdateSchema>;

export const biometricsSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsNumberLiteral([10, 20, 30, 40, 50]).withDefault(10),
  sort: getSortingStateParser<BiometricResponse>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  individual: parseAsString,
  active: parseAsArrayOf(parseAsBoolean),
});

export type BiometricsGetSchema = Awaited<
  ReturnType<typeof biometricsSearchParamsCache.parse>
>;

export const biometricsPaginatedResponseSchema = z.object({
  data: biometricResponseSchema.array(),
  pageCount: z.number(),
});

export type BiometricsPaginatedResponse = z.infer<
  typeof biometricsPaginatedResponseSchema
>;
