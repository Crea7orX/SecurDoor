import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { OrganizationSwitcher } from "@clerk/nextjs";
import * as React from "react";

export function DashboardSidebarFooter() {
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
            },
          }}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
