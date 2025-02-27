import { LogDisplayInfos } from "@/config/logs";
import type { LogResponse } from "@/lib/validations/log";
import { CircleHelp } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

export function useLog(log: LogResponse) {
  const t = useTranslations();

  return React.useMemo(() => {
    const logDisplayInfo = LogDisplayInfos[log.action] ?? {
      title: "Log.logs.unknown.title",
      text: ({ t }) => t("Log.logs.unknown.text"),
      icon: CircleHelp,
      color: "warning",
    };

    const actionActor =
      log.actorId === "system"
        ? t("Log.card.actor.system")
        : `${log.actorName ?? ""}${log.actorEmail ? (log.actorName ? ` (${log.actorEmail})` : `${log.actorEmail}`) : ""}`;

    return {
      ...logDisplayInfo,
      text: logDisplayInfo.text({ t, log, actionActor }),
    };
  }, [log, t]);
}
