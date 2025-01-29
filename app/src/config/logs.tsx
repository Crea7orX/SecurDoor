import { LogDisplayInfo } from "@/types";
import { CircleDot, CircleHelp, CircleMinus, CirclePlus } from "lucide-react";

export const LogDisplayInfos: Record<string, LogDisplayInfo> = {
  "card.create": {
    text: "{actor} created card",
    icon: CirclePlus,
    color: "success",
  },
  "card.delete": {
    text: "{actor} deleted card",
    icon: CircleMinus,
    color: "destructive",
  },
  "card.update": {
    text: "{actor} updated card",
    icon: CircleDot,
    color: "info",
  },
};

export function getLogDisplayInfo(action: string) {
  return (
    LogDisplayInfos[action] ?? {
      text: "Unknown",
      icon: CircleHelp,
      color: "warning",
    }
  );
}
