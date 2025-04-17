"use client";

import { ApiKeyCard } from "@/components/api-keys/api-key-card";
import { useGetAllApiKeysQuery } from "@/hooks/api/api-keys/use-get-all-api-keys-query";
import { cn } from "@/lib/utils";
import * as React from "react";

export function ApiKeysList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data, isLoading } = useGetAllApiKeysQuery({});

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      {data?.map((apiKey) => <ApiKeyCard apiKey={apiKey} key={apiKey.id} />)}
    </div>
  );
}
