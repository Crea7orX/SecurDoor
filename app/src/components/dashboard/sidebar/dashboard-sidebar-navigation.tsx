import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type Navigation } from "@/types";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface DashboardSidebarNavigationProps {
  items: Navigation[];
}

export function DashboardSidebarNavigation({
  items,
}: DashboardSidebarNavigationProps) {
  const _t = useTranslations();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{_t("Navigation.dashboard")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              tooltip={_t(item.title)}
              isActive={item.active}
              asChild
            >
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{_t(item.title)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
