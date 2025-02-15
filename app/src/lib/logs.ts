import type { LogResponse } from "@/lib/validations/log";
import { format, isToday, isYesterday, parseISO } from "date-fns";

export function groupLogsByDay(logs: LogResponse[]) {
  // Group logs by date
  const groupsMap = logs.reduce((acc, log) => {
    const dateString = format(log.createdAt * 1000, "yyyy-MM-dd"); // ISO format

    if (!acc.has(dateString)) {
      acc.set(dateString, []);
    }
    acc.get(dateString)!.push(log);

    return acc;
  }, new Map<string, LogResponse[]>());

  // Convert map to array and sort descending
  return Array.from(groupsMap.entries())
    .sort(([a], [b]) => b.localeCompare(a)) // Sort dates descending
    .map(([dateString, logs]) => ({
      dateString,
      label: isToday(parseISO(dateString))
        ? "Today"
        : isYesterday(parseISO(dateString))
          ? "Yesterday"
          : format(parseISO(dateString), "dd.MM.yyyy"),
      logs,
    }));
}
