import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { testimonials } from "@/config/landing/testimonials";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

const LandingTestimonialsSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const _t = useTranslations();
  const t = useTranslations("Landing.testimonials");

  return (
    <section
      id="testimonials"
      className={cn("p-4 py-20", className)}
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
          <p className="max-w-3xl text-xs font-bold italic text-destructive">
            {t("disclaimer")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full border shadow-md">
              <CardContent className="flex-grow pt-6">
                <div className="mb-4 flex">
                  {Array(testimonial.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="size-6 fill-primary text-primary"
                      />
                    ))}
                </div>
                <blockquote className="text-lg italic">
                  &ldquo;{_t(testimonial.quote)}&rdquo;
                </blockquote>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div>
                  <p className="font-semibold">{_t(testimonial.author)}</p>
                  <p className="text-sm text-muted-foreground">
                    {_t(testimonial.position)}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});
LandingTestimonialsSection.displayName = "LandingTestimonialsSection";

export { LandingTestimonialsSection };
