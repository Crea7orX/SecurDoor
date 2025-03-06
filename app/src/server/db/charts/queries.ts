import "server-only";
import {
  type ChartAccessForWeekResponse,
  ChartActiveUsersForWeekResponse,
} from "@/lib/validations/chart";
import { db } from "@/server/db";
import { logs } from "@/server/db/logs/schema";
import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";
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

interface ChartGetActiveUsersForWeekProps {
  ownerId: string;
  userTimezone?: string;
  isDashboard?: boolean;
}

export async function chartGetActiveUsersForWeek({
  ownerId,
  userTimezone = "UTC",
  isDashboard = false,
}: ChartGetActiveUsersForWeekProps) {
  // Get start date
  const now = new Date();
  const zonedTime = toZonedTime(now, userTimezone);
  const startDate = startOfDay(subDays(zonedTime, 7));

  // Determine the action types
  const unlockAction = isDashboard ? "device.unlock" : "card.unlock";
  const lockAction = isDashboard ? "device.lock" : "card.lock";

  // Build the CASE WHEN expressions
  const unlockCondition =
    sql<number>`COALESCE(SUM(CASE WHEN action = ${unlockAction} THEN 1 ELSE 0 END), 0)`.as(
      "unlocks",
    );
  const lockCondition =
    sql<number>`COALESCE(SUM(CASE WHEN action = ${lockAction} THEN 1 ELSE 0 END), 0)`.as(
      "locks",
    );

  // Query data from logs
  const rawData = await db
    .select({
      name: isDashboard
        ? sql<string>`actor_name`.as("name")
        : sql<string>`reference->>1`.as("name"),
      unlocks: unlockCondition,
      locks: lockCondition,
    })
    .from(logs)
    .where(
      and(
        eq(logs.ownerId, ownerId), // Ensure ownership
        sql`created_at >= ${Math.floor(startDate.getTime() / 1000)}`, // Use correct timestamp comparison
        isDashboard ? not(eq(logs.actorId, "system")) : undefined, // Exclude system logs if on the dashboard
        !isDashboard ? not(eq(sql<string>`reference->>1`, "NULL")) : undefined, // Exclude cards without holder name
      ),
    )
    .groupBy(sql`name`) // Group by the name field
    .having(
      sql`SUM(CASE WHEN action = ${unlockAction} THEN 1 ELSE 0 END) > 0 OR SUM(CASE WHEN action = ${lockAction} THEN 1 ELSE 0 END) > 0`, // Ensure there is at least one unlock or lock
    )
    .orderBy(
      sql`SUM(CASE WHEN action = ${unlockAction} THEN 1 ELSE 0 END) + SUM(CASE WHEN action = ${lockAction} THEN 1 ELSE 0 END) DESC`,
    )
    .limit(10);

  // Convert raw data into the correct format
  const chartData: ChartActiveUsersForWeekResponse[] = rawData.map(
    ({ name, unlocks, locks }) => ({
      name,
      unlocks: +unlocks,
      locks: +locks,
      total: +unlocks + +locks,
    }),
  );

  return chartData;
}
