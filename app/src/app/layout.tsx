import "@/styles/globals.css";
import { ProvidersWithoutTheme } from "@/components/providers/providers-without-theme";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GeistSans } from "geist/font/sans";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import * as React from "react";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Common.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    icons: [{ rel: "icon", url: "/assets/icon_white.png" }],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${GeistSans.variable}`}>
      <body className="flex h-dvh bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ProvidersWithoutTheme>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </ProvidersWithoutTheme>
        </ThemeProvider>
      </body>
    </html>
  );
}
