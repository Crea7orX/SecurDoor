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
      actor: ({ t }) => t("Log.activity_card.by.unknown"),
      icon: CircleHelp,
      color: "warning",
    };

    const actionActor =
      log.actorId === "system"
        ? t("Log.card.actor.system")
        : `${log.actorName ?? ""}${log.actorEmail ? (log.actorName ? ` (${log.actorEmail})` : `${log.actorEmail}`) : ""}`;
    const actionShortActor =
      log.actorId === "system"
        ? t("Log.activity_card.by.system")
        : `${log.actorName ?? log.actorEmail ?? t("Log.activity_card.by.unknown")}`;

    return {
      ...logDisplayInfo,
      text: logDisplayInfo.text({ t, log, actionActor }),
      actor: logDisplayInfo.actor
        ? logDisplayInfo.actor({ t, log })
        : actionShortActor,
    };
  }, [log, t]);
}
