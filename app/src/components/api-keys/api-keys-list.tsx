"use client";

import {
  ApiKeyCard,
  ApiKeyCardSkeleton,
} from "@/components/api-keys/api-key-card";
import { NoResultsLabel } from "@/components/data-table/no-results-label";
import { useGetAllApiKeysQuery } from "@/hooks/api/api-keys/use-get-all-api-keys-query";
import { cn } from "@/lib/utils";
import * as React from "react";

export function ApiKeysList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data, isLoading } = useGetAllApiKeysQuery({});

  if (isLoading) return <ApiKeysListSkeleton className={className} />;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-1",
        className,
      )}
      {...props}
    >
      {data?.length ? (
        data.map((apiKey) => <ApiKeyCard apiKey={apiKey} key={apiKey.id} />)
      ) : (
        <>
          <NoResultsLabel className="top-1/2 -translate-y-1/2" />
          {Array.from({ length: 3 }).map((_, index) => (
            <ApiKeyCardSkeleton key={index} className="opacity-50" />
          ))}
        </>
      )}
    </div>
  );
}

export function ApiKeysListSkeleton({
  className,
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {Array.from({ length: 3 }).map((_, index) => (
        <ApiKeyCardSkeleton key={index} />
      ))}
    </div>
  );
}
