"use client";

import { NoResultsLabel } from "@/components/data-table/no-results-label";
import {
  WebhookCard,
  WebhookCardSkeleton,
} from "@/components/webhooks/webhook-card";
import { useGetAllWebhooksQuery } from "@/hooks/api/webhooks/use-get-all-webhooks-query";
import { cn } from "@/lib/utils";
import * as React from "react";

export function WebhooksList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data, isLoading } = useGetAllWebhooksQuery({});

  if (isLoading) return <WebhookListSkeleton className={className} />;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-1",
        className,
      )}
      {...props}
    >
      {data?.length ? (
        data.map((webhook) => (
          <WebhookCard webhook={webhook} key={webhook.id} />
        ))
      ) : (
        <>
          <NoResultsLabel className="top-1/2 -translate-y-1/2" />
          {Array.from({ length: 3 }).map((_, index) => (
            <WebhookCardSkeleton key={index} className="opacity-50" />
          ))}
        </>
      )}
    </div>
  );
}

export function WebhookListSkeleton({
  className,
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {Array.from({ length: 3 }).map((_, index) => (
        <WebhookCardSkeleton key={index} />
      ))}
    </div>
  );
}
