"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import * as React from "react";

const NoResultsLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  const t = useTranslations("Data_Table");

  return (
    <span
      className={cn(
        "absolute z-10 rounded-xl border border-border bg-secondary p-4 text-center text-xl text-secondary-foreground ring ring-primary/20",
        className,
      )}
      ref={ref}
      {...props}
    >
      {t("no_results_label")}
    </span>
  );
});
NoResultsLabel.displayName = "NoResultsLabel";

export { NoResultsLabel };
