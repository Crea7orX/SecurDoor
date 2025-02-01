import { type LogDisplayInfo } from "@/types";
import {
  CircleDot,
  CircleHelp,
  CircleMinus,
  CirclePlus,
  Diamond,
  DiamondMinus,
  DiamondPlus,
} from "lucide-react";

export const LogDisplayInfos: Record<string, LogDisplayInfo> = {
  "device.create": {
    title: "Device created",
    text: "{actor} created device",
    icon: DiamondPlus,
    color: "success",
  },
  "device.delete": {
    title: "Device deleted",
    text: "{actor} deleted device",
    icon: DiamondMinus,
    color: "destructive",
  },
  "device.update": {
    title: "Device updated",
    text: "{actor} updated device",
    icon: Diamond,
    color: "info",
  },
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
