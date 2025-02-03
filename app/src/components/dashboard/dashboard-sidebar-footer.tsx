"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";

export function DashboardSidebarFooter() {
  const { state } = useSidebar();

  const { organization } = useOrganization();
  const queryClient = useQueryClient();

  // Clear query cache when organization changes
  // todo: Not ideal, not found better way to do this for now (@clerk/nextjs v5.7.2)
  React.useEffect(() => {
    queryClient.clear();
  }, [organization?.id]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/dashboard"
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
