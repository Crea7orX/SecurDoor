"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { OrganizationSwitcher } from "@clerk/nextjs";
import * as React from "react";

export function DashboardSidebarFooter() {
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/dashboard"
          afterSelectPersonalUrl="/auth/switch-active-organization"
          afterSelectOrganizationUrl="/auth/switch-active-organization"
          appearance={{
            variables: {
              fontSize: "lg",
            },
            elements: {
              rootBox: "w-full flex justify-center",
              organizationSwitcherTrigger: "p-0 overflow-hidden",
              userPreviewAvatarImage: "",
              userPreviewTextContainer: state === "collapsed" && "hidden",
              organizationSwitcherTriggerIcon:
                state === "collapsed" && "hidden",
            },
          }}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
