import { DashboardSidebar } from "@/components/dashboard/sidebar/dashboard-sidebar";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
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
        <DashboardSidebar />
        <div className="relative flex h-dvh min-w-0 flex-1 flex-col overflow-auto">
          <Header />
          <main className="relative flex-1 break-words">{children}</main>
          <Footer className="mt-auto" />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
