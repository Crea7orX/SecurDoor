"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type LogResponse } from "@/lib/validations/log";
import * as React from "react";

interface CardAddLogButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  cardFingerprint: string;
  setCardFingerprint: (cardFingerprint: string) => void;
  log: LogResponse;
}

const CardAddLogButton = React.forwardRef<
  HTMLDivElement,
  CardAddLogButtonProps
>(({ className, cardFingerprint, setCardFingerprint, log, ...props }, ref) => {
  return (
    <Card className={cn(className)} ref={ref} {...props}>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p>
            FID:{" "}
            <span className="font-semibold">
              {(log.reference![1] as string).slice(-8)}
            </span>
          </p>
          <p>
            Date:{" "}
            <span className="font-semibold">
              {new Date(log.createdAt * 1000).toLocaleString()}
            </span>
          </p>
        </div>
        <Button
          onClick={() => setCardFingerprint(log.reference![1] as string)}
          disabled={cardFingerprint === log.reference![1]}
        >
          {cardFingerprint === log.reference![1] ? "Selected" : "Select card"}
        </Button>
      </CardContent>
    </Card>
  );
});
CardAddLogButton.displayName = "CardAddLogButton";

const CardAddLogButtonSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <Card className={cn(className)} ref={ref} {...props}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-9 w-24" />
      </CardContent>
    </Card>
  );
});
CardAddLogButtonSkeleton.displayName = "CardAddLogButtonSkeleton";

export { CardAddLogButton, CardAddLogButtonSkeleton };
