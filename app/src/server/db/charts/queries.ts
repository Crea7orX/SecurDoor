import "server-only";
import { type ChartAccessForWeekResponse } from "@/lib/validations/chart";
import { db } from "@/server/db";
import { logs } from "@/server/db/logs/schema";
import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns";
import { and, eq, not, sql } from "drizzle-orm";

interface ChartGetAccessForWeekProps {
  ownerId: string;
  userTimezone?: string;
  isDashboard?: boolean;
}

export async function chartGetAccessForWeek({
  ownerId,
  userTimezone,
  isDashboard,
}: ChartGetAccessForWeekProps) {
  const timezone = userTimezone ?? "UTC";

  // Generate last 7 days as YYYY-MM-DD
  const now = new Date();
  const startDate = startOfDay(subDays(now, 7));
  const last7Days = eachDayOfInterval({ start: startDate, end: now }).map(
    (date) => format(date, "yyyy-MM-dd"),
  );

  // Query data from logs
  const rawData = await db
    .select({
      date: sql<string>`TO_CHAR(TIMEZONE(${timezone}, TO_TIMESTAMP(created_at)), 'YYYY-MM-DD')`.as(
        "date",
      ),
      unlocks: sql<number>`COALESCE(SUM(CASE WHEN action = ${
        isDashboard ? "device.unlock" : "card.unlock"
      } THEN 1 ELSE 0 END), 0)`,
      locks: sql<number>`COALESCE(SUM(CASE WHEN action = ${
        isDashboard ? "device.lock" : "card.lock"
      } THEN 1 ELSE 0 END), 0)`,
    })
    .from(logs)
    .where(
      and(
        eq(logs.ownerId, ownerId), // Ensure ownership
        sql`created_at >= ${Math.floor(startDate.getTime() / 1000)}`,
        isDashboard ? not(eq(logs.actorId, "system")) : undefined, // Exclude system logs if on the dashboard
      ),
    )
    .groupBy(sql`date`)
    .orderBy(sql`date`);

  // Convert raw data into a map for quick lookup
  const dataMap = new Map(
    rawData.map(({ date, unlocks, locks }) => [
      date,
      { date, unlocks: +unlocks, locks: +locks },
    ]),
  );

  const chartData: ChartAccessForWeekResponse[] = [];
  last7Days.forEach((date) => {
    chartData.push(dataMap.get(date) ?? { date, unlocks: 0, locks: 0 });
  });

  return chartData;
}
