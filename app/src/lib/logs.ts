import { LogDisplayInfos } from "@/config/logs";
import type { LogResponse } from "@/lib/validations/log";
import { CircleHelp } from "lucide-react";
import { type useTranslations } from "next-intl";

interface GetLogProps {
  t: ReturnType<typeof useTranslations>;
  logData: LogResponse;
}

export function getLog({ t, logData }: GetLogProps) {
  const logDisplayInfo = LogDisplayInfos[logData.action] ?? {
    title: "Log.logs.unknown.title",
    text: ({ t }) => t("Log.logs.unknown.text"),
    actor: ({ t }) => t("Log.activity_card.by.unknown"),
    icon: CircleHelp,
    color: "warning",
  };

  const actionActor =
    logData.actorId === "system"
      ? t("Log.card.actor.system")
      : `${logData.actorName ?? ""}${logData.actorEmail ? (logData.actorName ? ` (${logData.actorEmail})` : `${logData.actorEmail}`) : ""}`;
  const actionShortActor =
    logData.actorId === "system"
      ? t("Log.activity_card.by.system")
      : `${logData.actorName ?? logData.actorEmail ?? t("Log.activity_card.by.unknown")}`;

  return {
    ...logDisplayInfo,
    text: logDisplayInfo.text({ t, log: logData, actionActor }),
    actor: logDisplayInfo.actor
      ? logDisplayInfo.actor({ t, log: logData, actionActor: actionShortActor })
      : actionShortActor,
  };
}
