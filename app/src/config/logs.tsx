import { LogDisplayInfo } from "@/types";
import { CircleDot, CircleHelp, CircleMinus, CirclePlus } from "lucide-react";

export const LogDisplayInfos: Record<string, LogDisplayInfo> = {
  "card.create": {
    title: "Card created",
    text: "{actor} created card",
    icon: CirclePlus,
    color: "success",
  },
  "card.delete": {
    title: "Card deleted",
    text: "{actor} deleted card",
    icon: CircleMinus,
    color: "destructive",
  },
  "card.update": {
    title: "Card updated",
    text: "{actor} updated card",
    icon: CircleDot,
    color: "info",
  },
};

export function getLogDisplayInfo(action: string) {
  return (
    LogDisplayInfos[action] ?? {
      title: "Unknown",
      text: "Unknown",
      icon: CircleHelp,
      color: "warning",
    }
  );
}
