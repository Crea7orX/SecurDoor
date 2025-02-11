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
      text: "Pending adoption",
      icon: RectangleEllipsis,
      color: "warning",
    },
    adopting: {
      text: "Adopting",
      icon: EthernetPort,
      color: "info",
    },
    adopted: {
      text: "Adopted",
      icon: LaptopMinimalCheck,
      color: "success",
    },
  };

export function getDeviceStatusDisplayInfo(action: string) {
  return (
    DeviceStatusDisplayInfos[action] ?? {
      text: "Unknown",
      icon: CircleHelp,
      color: "warning",
    }
  );
}
