import { type LogDisplayInfo } from "@/types";
import {
  CircleHelp,
  CircleMinus,
  CirclePlus,
  Diamond,
  DiamondMinus,
  DiamondPlus,
  IdCard,
  OctagonMinus,
  ShieldCheck,
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
  "card.rename": {
    title: "Card renamed",
    text: "{actor} renamed card",
    icon: IdCard,
    color: "info",
  },
  "card.activate": {
    title: "Card activated",
    text: "{actor} activated card",
    icon: ShieldCheck,
    color: "success",
  },
  "card.deactivate": {
    title: "Card deactivated",
    text: "{actor} deactivated card",
    icon: OctagonMinus,
    color: "warning",
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
