import { Navigation } from "@/types";
import { Microchip, ScrollText } from "lucide-react";

export function getNavigationList(pathname: string): Navigation[] {
  return [
    {
      title: "Devices",
      url: "/dashboard/devices",
      icon: Microchip,
      active: pathname.includes("/devices"),
    },
    {
      title: "Logs",
      url: "/dashboard/logs",
      icon: ScrollText,
      active: pathname.includes("/admin/update-requests"),
    },
  ];
}
