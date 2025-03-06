import "server-only";
import {
  type ChartAccessForWeekResponse,
  type ChartActiveUsersForWeekResponse,
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
  userTimezone = "UTC",
  isDashboard = false,
}: ChartGetAccessForWeekProps) {
  // Get start date
  const now = new Date();
  const zonedTime = toZonedTime(now, userTimezone);
  const startDate = startOfDay(subDays(zonedTime, 7));

  // Generate last 7 days as YYYY-MM-DD
  const last7Days = eachDayOfInterval({ start: startDate, end: zonedTime }).map(
    (date) => format(date, "yyyy-MM-dd"),
  );

  // Determine action types
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
      date: sql<string>`TO_CHAR(TIMEZONE(${userTimezone}, TO_TIMESTAMP(created_at)), 'YYYY-MM-DD')`.as(
        "date",
      ),
      unlocks: unlockCondition,
      locks: lockCondition,
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

  // Initialize chart data map with default values for all days
  const dataMap = new Map<
    string,
    { date: string; unlocks: number; locks: number }
  >(
    last7Days.map((date) => [
      date,
      { date, unlocks: 0, locks: 0 }, // Default to 0 unlocks and locks for each day
    ]),
  );

  // Update map with actual data
  rawData.forEach(({ date, unlocks, locks }) => {
    if (dataMap.has(date)) {
      dataMap.set(date, { date, unlocks: +unlocks, locks: +locks });
    }
  });

  // Return the chart data in the correct format
  const chartData: ChartAccessForWeekResponse[] = last7Days.map(
    (date) => dataMap.get(date)!,
  );

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
        sql`created_at >= ${Math.floor(startDate.getTime() / 1000)}`,
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
