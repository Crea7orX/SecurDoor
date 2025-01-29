import * as React from "react";

export function useParseSearchParams<T extends { [key: string]: any }>(
  searchParams: T,
) {
  React.useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === null || value === undefined || value === "") continue;
      params.set(key, String(value));
    }
  }, [searchParams]);

  return Object.entries(searchParams)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("&");
}
