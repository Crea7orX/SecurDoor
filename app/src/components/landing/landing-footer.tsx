import { Logo } from "@/components/assets/logo";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

const LandingFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const t = useTranslations("Landing.footer");

  return (
    <footer
      className={cn("border-t bg-secondary p-4 py-12", className)}
      ref={ref}
      {...props}
    >
      <div className="container flex flex-col gap-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/#hero">
              <Logo className="w-32 lg:w-48" />
            </Link>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-medium">{t("product.label")}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/#features"
                  className="text-muted-foreground hover:text-info"
                >
                  {t("product.features")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimonials"
                  className="text-muted-foreground hover:text-info"
                >
                  {t("product.testimonials")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-muted-foreground hover:text-info"
                >
                  {t("product.pricing")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-medium">{t("authors.label")}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="https://github.com/Crea7orX"
                  target="_blank"
                  className="text-muted-foreground hover:text-info"
                >
                  {t("authors.author_1")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/DeyanVNikolov"
                  target="_blank"
                  className="text-muted-foreground hover:text-info"
                >
                  {t("authors.author_2")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-muted-foreground hover:text-info"
                >
                  {t("authors.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-medium">{t("links.label")}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="https://github.com/Crea7orX/SecurDoor"
                  target="_blank"
                  className="text-muted-foreground hover:text-info"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary pt-6 text-center text-sm text-muted-foreground">
          <p>
            {t.rich("copyright", {
              year: new Date().getFullYear(),
            })}
          </p>
        </div>
      </div>
    </footer>
  );
});
LandingFooter.displayName = "LandingFooter";

export { LandingFooter };
