import { getSortingStateParser } from "@/lib/data-table-parsers";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
} from "nuqs/server";
import { z } from "zod";

export const tagCreateSchema = z.object({
  name: z.string().min(2).max(256),
});

export type TagCreate = z.infer<typeof tagCreateSchema>;

export const tagResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
});

export type TagResponse = z.infer<typeof tagResponseSchema>;

export const tagUpdateSchema = z.object({
  name: z.string().min(2).max(256).optional(),
});

export type TagUpdate = z.infer<typeof tagUpdateSchema>;

export const tagsSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsNumberLiteral([10, 20, 30, 40, 50]).withDefault(10),
  sort: getSortingStateParser<TagResponse>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  name: parseAsString,
});

export type TagsGetSchema = Awaited<
  ReturnType<typeof tagsSearchParamsCache.parse>
>;

export const tagResponseExpandSchema = z.object({
  devicesCount: z.number().optional(),
});

export type TagResponseExpand = z.infer<typeof tagResponseExpandSchema>;

export const tagsPaginatedResponseSchema = z.object({
  data: tagResponseSchema.extend(tagResponseExpandSchema.shape).array(),
  pageCount: z.number(),
});

export type TagsPaginatedResponse = z.infer<typeof tagsPaginatedResponseSchema>;

export const tagBulkSchema = z.object({
  tagIds: z.array(z.string()),
});

export type TagBulk = z.infer<typeof tagBulkSchema>;
