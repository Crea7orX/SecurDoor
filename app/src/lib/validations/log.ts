import { LogDisplayInfos } from "@/config/logs";
import { getSortingStateParser } from "@/lib/data-table-parsers";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
} from "nuqs/server";
import { z } from "zod";

export const logResponseSchema = z.object({
  id: z.string(),
  action: z.string(),
  actor: z.string(),
  objectId: z.string().optional().nullable(),
  reference: z.string().array().optional().nullable(),
  ownerId: z.string(),
  createdAt: z.number(),
});

export type LogResponse = z.infer<typeof logResponseSchema>;

export const logSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<LogResponse>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  action: parseAsArrayOf(
    z.enum(Object.keys(LogDisplayInfos) as [keyof typeof LogDisplayInfos]),
  ).withDefault([]),
  actor: parseAsArrayOf(z.string()).withDefault([]),
});

export type LogsGetSchema = Awaited<
  ReturnType<typeof logSearchParamsCache.parse>
>;

export const logsPaginatedResponseSchema = z.object({
  data: logResponseSchema.array(),
  pageCount: z.number(),
});

export type LogsPaginatedResponse = z.infer<typeof logsPaginatedResponseSchema>;

export const logActorResponseSchema = z.object({
  actor: z.string(),
});

export type LogActorResponse = z.infer<typeof logActorResponseSchema>;
