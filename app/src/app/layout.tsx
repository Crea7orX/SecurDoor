import "@/styles/globals.css";
import { ApiProvider } from "@/components/providers/api-provider";
import { Toaster } from "@/components/ui/sonner";
import { TailwindIndicator } from "@/components/ui/tailwind-indicator";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import * as React from "react";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <ApiProvider>
        <html lang="en" className={`${GeistSans.variable}`}>
          <NuqsAdapter>
            <body className="relative min-h-screen bg-background">
              <div className="absolute -z-50 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
              {children}
              <Toaster />
              <TailwindIndicator />
            </body>
          </NuqsAdapter>
        </html>
      </ApiProvider>
    </ClerkProvider>
  );
}
