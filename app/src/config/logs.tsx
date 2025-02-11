import { type LogDisplayInfo } from "@/types";
import {
  CircleHelp,
  CircleMinus,
  CirclePlus,
  ClockAlert,
  DiamondMinus,
  DiamondPlus,
  EthernetPort,
  IdCard,
  LaptopMinimalCheck,
  Lock,
  LockOpen,
  Microchip,
  OctagonMinus,
  RectangleEllipsis,
  ShieldCheck,
  Siren,
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
  "device.rename": {
    title: "Device renamed",
    text: "{actor} renamed device",
    icon: Microchip,
    color: "info",
  },
  "device.re_lock_delay": {
    title: "Device re-lock delay updated",
    text: "{actor} updated device re-lock delay",
    icon: ClockAlert,
    color: "warning",
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
  "device.lock": {
    title: "Device locked",
    text: "{actor} locked device",
    icon: Lock,
    color: "destructive",
  },
  "device.unlock": {
    title: "Device unlocked",
    text: "{actor} unlocked device",
    icon: LockOpen,
    color: "success",
  },
  "device.emergency_state": {
    title: "Device emergency state updated",
    text: "{actor} updated device emergency state",
    icon: Siren,
    color: "destructive",
  },

  "device_status.pending_adoption": {
    title: "Device pending adoption",
    text: "{actor} set device in state pending adoption",
    icon: RectangleEllipsis,
    color: "warning",
  },
  "device_status.adopting": {
    title: "Device adopting",
    text: "{actor} set device in state adopting",
    icon: EthernetPort,
    color: "info",
  },
  "device_status.adopted": {
    title: "Device adopted",
    text: "{actor} set device in state adopted",
    icon: LaptopMinimalCheck,
    color: "success",
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
