import { z } from "zod";

export const chartAccessForWeekResponseSchema = z.object({
  date: z.string().date(),
  unlocks: z.number(),
  locks: z.number(),
});

export type ChartAccessForWeekResponse = z.infer<
  typeof chartAccessForWeekResponseSchema
>;

export const chartActiveUsersForWeekResponseSchema = z.object({
  name: z.string(),
  unlocks: z.number(),
  locks: z.number(),
  total: z.number(),
});

export type ChartActiveUsersForWeekResponse = z.infer<
  typeof chartActiveUsersForWeekResponseSchema
>;
