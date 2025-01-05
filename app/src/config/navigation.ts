import { Navigation } from "@/types";
import { IdCard, Microchip, ScrollText } from "lucide-react";

export function getNavigationList(pathname: string): Navigation[] {
  return [
    {
      title: "Devices",
      url: "/dashboard/devices",
      icon: Microchip,
      active: pathname.includes("/devices"),
    },
    {
      title: "Cards",
      url: "/dashboard/cards",
      icon: IdCard,
      active: pathname.includes("/cards"),
    },
    {
      title: "Logs",
      url: "/dashboard/logs",
      icon: ScrollText,
      active: pathname.includes("/admin/update-requests"),
    },
  ];
}
