import { getSortingStateParser } from "@/lib/data-table-parsers";
import { tagResponseSchema } from "@/lib/validations/tag";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsNumberLiteral,
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
  holder: z.string().min(2).max(256).optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export type CardUpdate = z.infer<typeof cardUpdateSchema>;

export const cardsSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsNumberLiteral([10, 20, 30, 40, 50]).withDefault(10),
  sort: getSortingStateParser<CardResponse>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  holder: parseAsString,
  active: parseAsArrayOf(parseAsBoolean),
});

export type CardsGetSchema = Awaited<
  ReturnType<typeof cardsSearchParamsCache.parse>
>;

export const cardsPaginatedResponseSchema = z.object({
  data: cardResponseSchema.array(),
  pageCount: z.number(),
});

export type CardsPaginatedResponse = z.infer<
  typeof cardsPaginatedResponseSchema
>;

export const cardTagsResponseSchema = z.object({
  tags: z.array(
    tagResponseSchema.pick({
      id: true,
      name: true,
    }),
  ),
});

export type CardTagsResponse = z.infer<typeof cardTagsResponseSchema>;

export const cardTagsUpdateSchema = z.object({
  tags: z.string().array(),
});

export type CardTagsUpdate = z.infer<typeof cardTagsUpdateSchema>;

export const cardTagsUpdateResponseSchema = z.object({
  addedTags: z.string().array(),
  removedTags: z.string().array(),
});

export type CardTagsUpdateResponse = z.infer<
  typeof cardTagsUpdateResponseSchema
>;
