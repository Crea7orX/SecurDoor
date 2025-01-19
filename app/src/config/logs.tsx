import { LogDisplayInfo } from "@/types";
import { CircleHelp, CircleMinus, CirclePlus } from "lucide-react";

const LogDisplayInfos: Record<string, LogDisplayInfo> = {
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
