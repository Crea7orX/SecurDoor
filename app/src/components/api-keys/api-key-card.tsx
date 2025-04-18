"use client";

import { ApiKeyDeleteAlertDialog } from "@/components/api-keys/api-key-delete-alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type ApiKeyResponse } from "@/lib/validations/api-key";
import { Clipboard, Eye, EyeOff, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

interface ApiKeyCardProps extends React.ComponentProps<"div"> {
  apiKey: ApiKeyResponse;
}

export function ApiKeyCard({ className, apiKey, ...props }: ApiKeyCardProps) {
  const t = useTranslations("ApiKey.card");

  const keyRef = React.useRef<HTMLDivElement>(null);
  const [isShown, setIsShown] = React.useState<boolean>(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(apiKey.key);
    toast.success(t("copy.notification"));
  };

  React.useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.clipboardData?.setData("text/plain", apiKey.key);
    };

    const element = keyRef.current;
    if (element) {
      element.addEventListener("copy", handleCopy);

      return () => {
        element.removeEventListener("copy", handleCopy);
      };
    }
  }, [apiKey.key]);

  return (
    <div
      className={cn(
        "group flex w-full flex-col justify-between gap-4 overflow-hidden rounded-md border-b-2 p-4 last:border-0 hover:bg-muted lg:flex-row",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col">
        <p className="font-semibold">{apiKey.name}</p>
        <p className="text-muted-foreground">
          {t.rich("created_at", {
            date: new Date(apiKey.createdAt * 1000).toLocaleString(),
            semibold: (chunks) => (
              <span className="font-semibold">{chunks}</span>
            ),
          })}
        </p>
        <p className="text-muted-foreground">
          {apiKey.lastUsedAt ? (
            t.rich("last_used_at.text", {
              date: new Date(apiKey.lastUsedAt * 1000).toLocaleString(),
              semibold: (chunks) => (
                <span className="font-semibold">{chunks}</span>
              ),
            })
          ) : (
            <span className="text-destructive">{t("last_used_at.never")}</span>
          )}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex h-9 items-center rounded-md border border-input bg-muted shadow-sm">
          <div
            className="select-all truncate pe-3 ps-3 font-mono text-sm leading-6 tracking-tight"
            ref={keyRef}
          >
            {isShown ? (
              <span>
                {apiKey.key.slice(0, 12)}…{apiKey.key.slice(-19)}
              </span>
            ) : (
              "••••••••••••••••••••••••••••••••"
            )}
          </div>
        </div>
        <div className="w-fit whitespace-nowrap rounded-md border group-hover:border-input max-sm:self-end lg:border-card">
          <Button
            variant="outline"
            size="icon"
            className="rounded-r-none border-0 shadow-none"
            onClick={copyToClipboard}
          >
            <Clipboard />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="not-group-hover:hidden rounded-none border-0 border-x shadow-none group-hover:visible lg:invisible"
            onClick={() => setIsShown(!isShown)}
          >
            {isShown ? <EyeOff /> : <Eye />}
          </Button>
          <ApiKeyDeleteAlertDialog id={apiKey.id}>
            <Button
              variant="outline"
              size="icon"
              className="rounded-l-none border-0 !text-destructive shadow-none group-hover:visible lg:invisible"
            >
              <Trash />
            </Button>
          </ApiKeyDeleteAlertDialog>
        </div>
      </div>
    </div>
  );
}

export function ApiKeyCardSkeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full flex-col justify-between gap-4 overflow-hidden rounded-md border-b-2 p-4 last:border-0 hover:bg-muted lg:flex-row",
        className,
      )}
      {...props}
    >
      <div className="flex w-full flex-col gap-1">
        <Skeleton className="h-6 w-full max-w-32" />
        <Skeleton className="h-5 w-full max-w-64" />
        <Skeleton className="h-5 w-full max-w-64" />
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:justify-end">
        <Skeleton className="h-9 w-full sm:w-[16.5rem]" />
        <Skeleton className="h-9 w-[6.75rem]" />
      </div>
    </div>
  );
}
