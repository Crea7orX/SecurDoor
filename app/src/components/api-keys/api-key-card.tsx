"use client";

import { ApiKeyDeleteAlertDialog } from "@/components/api-keys/api-key-delete-alert-dialog";
import { Button } from "@/components/ui/button";
import { type ApiKeyResponse } from "@/lib/validations/api-key";
import { Clipboard, Eye, EyeOff, Trash } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

interface ApiKeyCardProps {
  apiKey: ApiKeyResponse;
}

export function ApiKeyCard({ apiKey }: ApiKeyCardProps) {
  const keyRef = React.useRef<HTMLDivElement>(null);
  const [isShown, setIsShown] = React.useState<boolean>(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(apiKey.key);
    toast.success("Secret key copied to clipboard!");
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
    <div className="group flex flex-col justify-between gap-4 overflow-hidden rounded-md border-b-2 p-4 last:border-0 hover:bg-muted lg:flex-row">
      <div className="flex flex-col">
        <p className="font-semibold">{apiKey.name}</p>
        <p className="text-muted-foreground">
          Created at {new Date(apiKey.createdAt * 1000).toLocaleString()}
        </p>
        <p className="text-muted-foreground">
          {apiKey.lastUsedAt ? (
            <>
              Last used at {new Date(apiKey.lastUsedAt * 1000).toLocaleString()}
            </>
          ) : (
            <span className="text-destructive">Never used</span>
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
