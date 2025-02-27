import { type LogResponse } from "@/lib/validations/log";
import type { LucideIcon } from "lucide-react";
import { type useTranslations } from "next-intl";
import type * as React from "react";

export type Navigation = {
  title: string;
  url: string;
  icon?: LucideIcon;
  active?: boolean;
};

export type LogDisplayInfo = {
  title: string;
  text: ({
    t,
    log,
    actionActor,
  }: {
    t: ReturnType<typeof useTranslations>;
    log: LogResponse;
    actionActor: string;
  }) => React.ReactNode;
  icon: LucideIcon;
  color:
    | "default"
    | "destructive"
    | "secondary"
    | "success"
    | "info"
    | "warning";
};

export type DeviceStatusDisplayInfo = {
  text: string;
  icon: LucideIcon;
  color:
    | "default"
    | "destructive"
    | "secondary"
    | "success"
    | "info"
    | "warning";
};
