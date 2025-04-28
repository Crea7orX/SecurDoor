import { getLog } from "@/lib/logs";
import type { LogResponse } from "@/lib/validations/log";
import { useTranslations } from "next-intl";
import * as React from "react";

export function useLog(log: LogResponse) {
  const t = useTranslations();

  return React.useMemo(
    () =>
      getLog({
        t,
        logData: log,
      }),
    [log, t],
  );
}
