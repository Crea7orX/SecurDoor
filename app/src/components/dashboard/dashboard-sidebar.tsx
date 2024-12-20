"use client";

import { DashboardSidebarNavigation } from "@/components/dashboard/dashboard-sidebar-navigation";
import { DashboardSidebarFooter } from "@/components/dashboard/dashboard-sidebar-footer";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getNavigationList } from "@/config/navigation";
import { usePathname } from "next/navigation";
import * as React from "react";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const navigationItems = React.useMemo(
    () => getNavigationList(pathname),
    [pathname],
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-12 items-end justify-center">
        <SidebarTrigger className="mr-0.5" />
      </SidebarHeader>
      <SidebarContent>
        <DashboardSidebarNavigation items={navigationItems} />
      </SidebarContent>
      <SidebarFooter className="min-h-10 justify-center bg-sidebar-border">
        <DashboardSidebarFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
