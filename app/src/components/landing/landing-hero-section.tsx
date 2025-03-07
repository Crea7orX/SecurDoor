import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Fingerprint, Key, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

const LandingHeroSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const t = useTranslations("Landing.hero");

  return (
    <section
      id="hero"
      className={cn(
        "container flex flex-col items-center justify-center gap-8 overflow-hidden p-4 py-20",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          {t("title")}
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl/relaxed">
          {t.rich("description", {
            strong: (chunks) => <span className="font-bold">{chunks}</span>,
          })}
        </p>
      </div>
      <Button size="lg" className="gap-1" asChild>
        <Link href="/dashboard">
          {t("button")} <ArrowRight className="size-4" />
        </Link>
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-8">
        <div className="flex items-center gap-2">
          <Shield className="size-6 text-info" />
          <span>{t("tag.1")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Key className="size-6 text-info" />
          <span>{t("tag.2")}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Fingerprint className="size-6 text-info" />
          <span>{t("tag.3")}</span>
          <Badge variant="info" className="rounded-full">
            {t("tag.coming_soon")}
          </Badge>
        </div>
      </div>
    </section>
  );
});
LandingHeroSection.displayName = "LandingHeroSection";

export { LandingHeroSection };
