import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import * as React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignedIn>
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset className="bg-transparent">
            <Header />
            {children}
            <Footer className="mt-auto" />
          </SidebarInset>
        </SidebarProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
