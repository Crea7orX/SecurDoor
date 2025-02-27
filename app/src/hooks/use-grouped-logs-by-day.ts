import type { LogResponse } from "@/lib/validations/log";
import { isToday, isYesterday } from "date-fns";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo } from "react";

export function useGroupedLogsByDay(logs: LogResponse[]) {
  const t = useTranslations("Log.date_group");
  const format = useFormatter();

  return useMemo(() => {
    const groupsMap = logs.reduce((acc, log) => {
      const dateString = format.dateTime(log.createdAt * 1000, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      if (!acc.has(dateString)) {
        acc.set(dateString, []);
      }
      acc.get(dateString)!.push(log);

      return acc;
    }, new Map<string, LogResponse[]>());

    return Array.from(groupsMap.entries())
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([dateString, logs]) => {
        const date = logs[0]!.createdAt * 1000;
        return {
          dateString,
          label: isToday(date)
            ? t("today")
            : isYesterday(date)
              ? t("yesterday")
              : format.dateTime(date, {
                  dateStyle: "medium",
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                }),
          logs,
        };
      });
  }, [logs, t, format]);
}
