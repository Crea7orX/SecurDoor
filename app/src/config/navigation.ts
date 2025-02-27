import { type Navigation } from "@/types";
import { IdCard, Microchip, ScrollText } from "lucide-react";

export function getNavigationList(pathname: string): Navigation[] {
  return [
    {
      title: "Navigation.devices",
      url: "/dashboard/devices",
      icon: Microchip,
      active: pathname.includes("/devices"),
    },
    {
      title: "Navigation.cards",
      url: "/dashboard/cards",
      icon: IdCard,
      active: pathname.includes("/cards"),
    },
    {
      title: "Navigation.logs",
      url: "/dashboard/logs",
      icon: ScrollText,
      active: pathname.includes("/logs"),
    },
  ];
}
