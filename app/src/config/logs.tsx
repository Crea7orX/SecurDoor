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
  ShieldX,
  Siren,
} from "lucide-react";

export const LogDisplayInfos: Record<string, LogDisplayInfo> = {
  "device.create": {
    title: "Log.logs.device.create.title",
    text: "Log.logs.device.create.text",
    icon: DiamondPlus,
    color: "success",
  },
  "device.delete": {
    title: "Log.logs.device.delete.title",
    text: "Log.logs.device.delete.text",
    icon: DiamondMinus,
    color: "destructive",
  },
  "device.rename": {
    title: "Log.logs.device.rename.title",
    text: "Log.logs.device.rename.text",
    icon: Microchip,
    color: "info",
  },
  "device.re_lock_delay": {
    title: "Log.logs.device.re_lock_delay.title",
    text: "Log.logs.device.re_lock_delay.text",
    icon: ClockAlert,
    color: "warning",
  },
  "device.access_update": {
    title: "Log.logs.device.access_update.title",
    text: "Log.logs.device.access_update.text",
    icon: IdCard,
    color: "info",
  },
  "device.add_card": {
    title: "Log.logs.device.add_card.title",
    text: "Log.logs.device.add_card.text",
    icon: IdCard,
    color: "success",
  },
  "device.remove_card": {
    title: "Log.logs.device.remove_card.title",
    text: "Log.logs.device.remove_card.text",
    icon: IdCard,
    color: "destructive",
  },
  "device.lock": {
    title: "Log.logs.device.lock.title",
    text: "Log.logs.device.lock.text",
    icon: Lock,
    color: "destructive",
  },
  "device.unlock": {
    title: "Log.logs.device.unlock.title",
    text: "Log.logs.device.unlock.text",
    icon: LockOpen,
    color: "success",
  },
  "device.emergency_state": {
    title: "Log.logs.device.emergency_state.title",
    text: "Log.logs.device.emergency_state.text",
    icon: Siren,
    color: "destructive",
  },
  "device.access_denied": {
    title: "Log.logs.device.access_denied.title",
    text: "Log.logs.device.access_denied.text",
    icon: ShieldX,
    color: "destructive",
  },

  "device_status.pending_adoption": {
    title: "Log.logs.device_status.pending_adoption.title",
    text: "Log.logs.device_status.pending_adoption.text",
    icon: RectangleEllipsis,
    color: "warning",
  },
  "device_status.adopting": {
    title: "Log.logs.device_status.adopting.title",
    text: "Log.logs.device_status.adopting.text",
    icon: EthernetPort,
    color: "info",
  },
  "device_status.adopted": {
    title: "Log.logs.device_status.adopted.title",
    text: "Log.logs.device_status.adopted.text",
    icon: LaptopMinimalCheck,
    color: "success",
  },

  "card.create": {
    title: "Log.logs.card.create.title",
    text: "Log.logs.card.create.text",
    icon: CirclePlus,
    color: "success",
  },
  "card.delete": {
    title: "Log.logs.card.delete.title",
    text: "Log.logs.card.delete.text",
    icon: CircleMinus,
    color: "destructive",
  },
  "card.rename": {
    title: "Log.logs.card.rename.title",
    text: "Log.logs.card.rename.text",
    icon: IdCard,
    color: "info",
  },
  "card.activate": {
    title: "Log.logs.card.activate.title",
    text: "Log.logs.card.activate.text",
    icon: ShieldCheck,
    color: "success",
  },
  "card.deactivate": {
    title: "Log.logs.card.deactivate.title",
    text: "Log.logs.card.deactivate.text",
    icon: OctagonMinus,
    color: "warning",
  },
  "card.access_update": {
    title: "Log.logs.card.access_update.title",
    text: "Log.logs.card.access_update.text",
    icon: IdCard,
    color: "info",
  },
  "card.add_device": {
    title: "Log.logs.card.add_device.title",
    text: "Log.logs.card.add_device.text",
    icon: Microchip,
    color: "success",
  },
  "card.remove_device": {
    title: "Log.logs.card.remove_device.title",
    text: "Log.logs.card.remove_device.text",
    icon: Microchip,
    color: "destructive",
  },
  "card.lock": {
    title: "Log.logs.card.lock.title",
    text: "Log.logs.card.lock.text",
    icon: Lock,
    color: "destructive",
  },
  "card.unlock": {
    title: "Log.logs.card.unlock.title",
    text: "Log.logs.card.unlock.text",
    icon: LockOpen,
    color: "success",
  },
};

export function getLogDisplayInfo(action: string) {
  return (
    LogDisplayInfos[action] ?? {
      title: "Log.logs.unknown.title",
      text: "Log.logs.unknown.text",
      icon: CircleHelp,
      color: "warning",
    }
  );
}
