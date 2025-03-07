import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingPlans } from "@/config/landing/pricing";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

const LandingPricingSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const _t = useTranslations();
  const t = useTranslations("Landing.pricing");

  return (
    <section
      id="pricing"
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
            {t("description")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={cn(
                "relative shadow-md",
                plan.popular && "border-info shadow-lg",
              )}
            >
              {plan.popular && (
                <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-info px-3 py-1 text-xs font-semibold text-info-foreground">
                  {t("popular")}
                </div>
              )}
              <CardHeader>
                <CardTitle>{_t(plan.name)}</CardTitle>
                <div className="items-baseline">
                  <span className="text-3xl font-bold">{_t(plan.price)}</span>
                  <span className="ml-1 text-muted-foreground">
                    {_t(plan.period)}
                  </span>
                </div>
                <CardDescription>{_t(plan.description)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex">
                      <Check className="mr-2 size-6 shrink-0 text-success" />
                      <span>{_t(feature)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.buttonVariant} asChild>
                  <Link href={plan.buttonHref}>{_t(plan.buttonText)}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});
LandingPricingSection.displayName = "LandingPricingSection";

export { LandingPricingSection };
