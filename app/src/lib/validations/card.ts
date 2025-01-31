import { getSortingStateParser } from "@/lib/data-table-parsers";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsBoolean,
  parseAsString,
} from "nuqs/server";
import { z } from "zod";

export const cardCreateSchema = z.object({
  fingerprint: z.string().min(8).max(32),
  holder: z.string().min(2).max(256).optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export type CardCreate = z.infer<typeof cardCreateSchema>;

export const cardResponseSchema = z.object({
  id: z.string(),
  fingerprint: z.string(),
  holder: z.string().optional().nullable(),
  active: z.boolean(),
  ownerId: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
});

export type CardResponse = z.infer<typeof cardResponseSchema>;

export const cardUpdateSchema = z.object({
  holder: z.string().optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export type CardUpdate = z.infer<typeof cardUpdateSchema>;

export const cardSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsNumberLiteral([10, 20, 30, 40, 50]).withDefault(10),
  sort: getSortingStateParser<CardResponse>().withDefault([
    { id: "createdAt", desc: false },
  ]),
  holder: parseAsString,
  active: parseAsArrayOf(parseAsBoolean),
});

export type CardGetSchema = Awaited<
  ReturnType<typeof cardSearchParamsCache.parse>
>;

export const cardsPaginatedResponseSchema = z.object({
  data: cardResponseSchema.array(),
  pageCount: z.number(),
});

export type CardsPaginatedResponse = z.infer<
  typeof cardsPaginatedResponseSchema
>;
