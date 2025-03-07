import { Logo } from "@/components/assets/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

const LandingNavbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/#hero">
          <Logo className="w-40" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden gap-6 md:flex">
          <LandingNavbarLinks />
        </nav>

        <div className="hidden gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <LandingNavbarDashboardButton />
        </div>

        {/* Mobile Menu */}
        <div className="flex gap-2 md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="flex flex-col gap-6 p-6">
              <nav className="flex flex-col space-y-4">
                <LandingNavbarLinks />
              </nav>
              <LandingNavbarDashboardButton />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
});
LandingNavbar.displayName = "LandingNavbar";

const LandingNavbarLinks = () => {
  const t = useTranslations("Landing.header.link");

  return (
    <>
      <Link href="/#features" className="text-sm font-medium hover:text-info">
        {t("features")}
      </Link>
      <Link
        href="/#testimonials"
        className="text-sm font-medium hover:text-info"
      >
        {t("testimonials")}
      </Link>
      <Link href="/#pricing" className="text-sm font-medium hover:text-info">
        {t("pricing")}
      </Link>
      <Link href="/#contact" className="text-sm font-medium hover:text-info">
        {t("contact")}
      </Link>
    </>
  );
};

const LandingNavbarDashboardButton = () => {
  const t = useTranslations("Landing.header.button");

  return (
    <Button>
      <Link href="/dashboard">
        <SignedIn>{t("dashboard")}</SignedIn>
        <SignedOut>{t("login")}</SignedOut>
      </Link>
    </Button>
  );
};

export { LandingNavbar };
