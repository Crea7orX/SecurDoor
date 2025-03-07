import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { features } from "@/config/landing/features";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import * as React from "react";

const LandingFeaturesSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const _t = useTranslations();
  const t = useTranslations("Landing.features");

  return (
    <section
      id="features"
      className={cn("bg-secondary p-4 py-20", className)}
      ref={ref}
      {...props}
    >
      <div className="container flex flex-col gap-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="max-w-3xl text-muted-foreground md:text-xl/relaxed">
            {t.rich("description", {
              strong: (chunks) => <span className="font-bold">{chunks}</span>,
            })}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="relative shadow-md transition-shadow hover:shadow-lg"
            >
              {feature.comingSoon && (
                <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-info px-3 py-1 text-xs font-semibold text-info-foreground">
                  {t("feature.coming_soon")}
                </div>
              )}
              <CardHeader className="gap-2 pb-2">
                {feature.icon}
                <CardTitle>{_t(feature.title)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {_t(feature.description)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});
LandingFeaturesSection.displayName = "LandingFeaturesSection";

export { LandingFeaturesSection };
