"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

const NoResultsLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      className={cn(
        "absolute z-10 rounded-xl border border-border bg-secondary p-4 text-xl text-secondary-foreground ring ring-primary/20",
        className,
      )}
      ref={ref}
      {...props}
    >
      No results.
    </span>
  );
});
NoResultsLabel.displayName = "NoResultsLabel";

export { NoResultsLabel };
