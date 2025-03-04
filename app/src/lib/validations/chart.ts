import { z } from "zod";

export const chartAccessForWeekResponseSchema = z.object({
  date: z.string().date(),
  unlocks: z.number(),
  locks: z.number(),
});

export type ChartAccessForWeekResponse = z.infer<
  typeof chartAccessForWeekResponseSchema
>;
