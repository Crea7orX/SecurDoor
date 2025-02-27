import { type DeviceStatusDisplayInfo } from "@/types";
import {
  CircleHelp,
  EthernetPort,
  LaptopMinimalCheck,
  RectangleEllipsis,
} from "lucide-react";

export const DeviceStatusDisplayInfos: Record<string, DeviceStatusDisplayInfo> =
  {
    pending_adoption: {
      text: "Device.status.state.pending_adoption",
      icon: RectangleEllipsis,
      color: "warning",
    },
    adopting: {
      text: "Device.status.state.adopting",
      icon: EthernetPort,
      color: "info",
    },
    adopted: {
      text: "Device.status.state.adopted",
      icon: LaptopMinimalCheck,
      color: "success",
    },
  };

export function getDeviceStatusDisplayInfo(action: string) {
  return (
    DeviceStatusDisplayInfos[action] ?? {
      text: "Device.status.state.unknown",
      icon: CircleHelp,
      color: "warning",
    }
  );
}
