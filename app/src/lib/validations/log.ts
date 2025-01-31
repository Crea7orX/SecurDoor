import { LogDisplayInfos } from "@/config/logs";
import { getSortingStateParser } from "@/lib/data-table-parsers";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsNumberLiteral,
} from "nuqs/server";
import { z } from "zod";

export const logResponseSchema = z.object({
  id: z.string(),
  action: z.string(),
  actorName: z.string().nullable(),
  actorEmail: z.string().email().nullable(),
  actorId: z.string(),
  objectId: z.string().optional().nullable(),
  reference: z.string().array().optional().nullable(),
  ownerId: z.string(),
  createdAt: z.number(),
});

export type LogResponse = z.infer<typeof logResponseSchema>;

export const logsSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsNumberLiteral([10, 20, 30, 40, 50]).withDefault(10),
  sort: getSortingStateParser<LogResponse>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  action: parseAsArrayOf(
    z.enum(Object.keys(LogDisplayInfos) as [keyof typeof LogDisplayInfos]),
  ).withDefault([]),
  actorId: parseAsArrayOf(z.string()).withDefault([]),
});

export type LogsGetSchema = Awaited<
  ReturnType<typeof logsSearchParamsCache.parse>
>;

export const logsPaginatedResponseSchema = z.object({
  data: logResponseSchema.array(),
  pageCount: z.number(),
});

export type LogsPaginatedResponse = z.infer<typeof logsPaginatedResponseSchema>;

export const logActorResponseSchema = z.object({
  actorName: z.string().nullable(),
  actorEmail: z.string().email().nullable(),
  actorId: z.string(),
});

export type LogActorResponse = z.infer<typeof logActorResponseSchema>;
