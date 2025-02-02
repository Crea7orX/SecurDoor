import { type LogDisplayInfo } from "@/types";
import {
  CircleHelp,
  CircleMinus,
  CirclePlus,
  Diamond,
  DiamondMinus,
  DiamondPlus,
  IdCard,
  Microchip,
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
  "device.access_update": {
    title: "Device access updated",
    text: "{actor} updated device access",
    icon: IdCard,
    color: "info",
  },
  "device.add_card": {
    title: "Device added to card",
    text: "{actor} added device to card",
    icon: IdCard,
    color: "success",
  },
  "device.remove_card": {
    title: "Device removed from card",
    text: "{actor} removed device from card",
    icon: IdCard,
    color: "destructive",
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
  "card.access_update": {
    title: "Card access updated",
    text: "{actor} updated card access",
    icon: IdCard,
    color: "info",
  },
  "card.add_device": {
    title: "Card added to device",
    text: "{actor} added card to device",
    icon: Microchip,
    color: "success",
  },
  "card.remove_device": {
    title: "Card removed from device",
    text: "{actor} removed card from device",
    icon: Microchip,
    color: "destructive",
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
