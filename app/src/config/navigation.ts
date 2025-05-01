import { type Navigation } from "@/types";
import {
  Fingerprint,
  House,
  IdCard,
  Microchip,
  ScrollText,
  Settings,
  Tag,
} from "lucide-react";

export function getNavigationList(pathname: string): Navigation[] {
  return [
    {
      title: "Navigation.home",
      url: "/dashboard",
      icon: House,
      active: pathname.endsWith("/dashboard"),
    },
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
      title: "Navigation.biometrics",
      url: "/dashboard/biometrics",
      icon: Fingerprint,
      active: pathname.includes("/biometrics"),
    },
    {
      title: "Navigation.tags",
      url: "/dashboard/tags",
      icon: Tag,
      active: pathname.includes("/tags"),
    },
    {
      title: "Navigation.logs",
      url: "/dashboard/logs",
      icon: ScrollText,
      active: pathname.includes("/logs"),
    },
    {
      title: "Navigation.settings",
      url: "/dashboard/settings",
      icon: Settings,
      active: pathname.includes("/settings"),
    },
  ];
}
