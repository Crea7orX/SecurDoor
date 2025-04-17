"use client";

import { ApiKeyCard } from "@/components/api-keys/api-key-card";
import { useGetAllApiKeysQuery } from "@/hooks/api/api-keys/use-get-all-api-keys-query";

export function ApiKeysList() {
  const { data, isLoading } = useGetAllApiKeysQuery({});

  return (
    <div className="">
      {data?.map((apiKey) => <ApiKeyCard apiKey={apiKey} key={apiKey.id} />)}
    </div>
  );
}
