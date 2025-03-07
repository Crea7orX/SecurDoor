import { LandingContactForm } from "@/components/landing/landing-contact-form";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import * as React from "react";

const LandingContactSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const t = useTranslations("Landing.contact");

  return (
    <section
      id="contact"
      className={cn("p-4 py-20", className)}
      ref={ref}
      {...props}
    >
      <div className="container flex flex-col items-center gap-16">
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

        <LandingContactForm />
      </div>
    </section>
  );
});
LandingContactSection.displayName = "LandingContactSection";

export { LandingContactSection };
