import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Header } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import * as React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-transparent">
        <Header />
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
