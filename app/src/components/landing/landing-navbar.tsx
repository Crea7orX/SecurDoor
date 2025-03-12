import { Logo } from "@/components/assets/logo";
import { LandingNavbarSheet } from "@/components/landing/landing-navbar-sheet";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut } from "@clerk/nextjs";
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
          <LandingNavbarSheet />
        </div>
      </div>
    </header>
  );
});
LandingNavbar.displayName = "LandingNavbar";

interface LandingNavbarLinksProps {
  onClick?: () => void;
}

const LandingNavbarLinks = ({ onClick }: LandingNavbarLinksProps) => {
  const t = useTranslations("Landing.header.link");

  return (
    <>
      <Link
        href="/#features"
        className="text-sm font-medium hover:text-info"
        onClick={onClick}
      >
        {t("features")}
      </Link>
      <Link
        href="/#testimonials"
        className="text-sm font-medium hover:text-info"
        onClick={onClick}
      >
        {t("testimonials")}
      </Link>
      <Link
        href="/#pricing"
        className="text-sm font-medium hover:text-info"
        onClick={onClick}
      >
        {t("pricing")}
      </Link>
      <Link
        href="/#contact"
        className="text-sm font-medium hover:text-info"
        onClick={onClick}
      >
        {t("contact")}
      </Link>
    </>
  );
};

const LandingNavbarDashboardButton = () => {
  const t = useTranslations("Landing.header.button");

  return (
    <Button asChild>
      <Link href="/dashboard">
        <SignedIn>{t("dashboard")}</SignedIn>
        <SignedOut>{t("login")}</SignedOut>
      </Link>
    </Button>
  );
};

export { LandingNavbar, LandingNavbarLinks, LandingNavbarDashboardButton };
