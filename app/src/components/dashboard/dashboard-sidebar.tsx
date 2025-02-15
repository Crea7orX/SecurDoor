"use client";

import { Logo } from "@/components/assets/logo";
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
import Link from "next/link";
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
      <SidebarHeader className="h-12 items-center justify-center border-b">
        <Link href="/">
          <Logo className="h-10" />
        </Link>
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
