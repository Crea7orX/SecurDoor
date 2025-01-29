import type { LucideIcon } from "lucide-react";

export type Navigation = {
  title: string;
  url: string;
  icon?: LucideIcon;
  active?: boolean;
};

export type LogDisplayInfo = {
  text: string;
  icon: LucideIcon;
  color:
    | "default"
    | "destructive"
    | "secondary"
    | "success"
    | "info"
    | "warning";
  description?: string; // todo
};
