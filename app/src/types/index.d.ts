import type { LucideIcon } from "lucide-react";

export type Navigation = {
  title: string;
  url: string;
  icon?: LucideIcon;
  active?: boolean;
};
