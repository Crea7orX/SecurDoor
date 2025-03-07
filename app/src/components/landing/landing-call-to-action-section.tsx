import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

const LandingCallToActionSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const t = useTranslations("Landing.call_to_action");

  return (
    <section
      className={cn("bg-info p-4 py-20 text-info-foreground", className)}
      ref={ref}
      {...props}
    >
      <div className="container flex max-w-3xl flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {t("title")}
        </h2>
        <p className="text-xl/relaxed opacity-90">
          {t.rich("description", {
            strong: (chunks) => <span className="font-bold">{chunks}</span>,
          })}
        </p>
        <Button size="lg" variant="secondary" className="gap-2" asChild>
          <Link href="/dashboard">
            {t("button")} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
});
LandingCallToActionSection.displayName = "LandingCallToActionSection";

export { LandingCallToActionSection };
