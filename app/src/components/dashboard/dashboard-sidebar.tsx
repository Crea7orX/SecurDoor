"use client";

import { DashboardSidebarFooter } from "@/components/dashboard/dashboard-sidebar-footer";
import { DashboardSidebarNavigation } from "@/components/dashboard/dashboard-sidebar-navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
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
    <Sidebar className="border-r" collapsible="none" {...props}>
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
