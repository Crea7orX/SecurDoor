"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WebhookDeleteAlertDialog } from "@/components/webhooks/webhook-delete-alert-dialog";
import { WebhookTestAlertDialog } from "@/components/webhooks/webhook-test-alert-dialog";
import { WebhookUpdateDialog } from "@/components/webhooks/webhook-update-dialog";
import { cn } from "@/lib/utils";
import { type WebhookResponse } from "@/lib/validations/webhook";
import { FlaskConical, SquarePen, Trash } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import * as React from "react";

interface WebhookCardProps extends React.ComponentProps<"div"> {
  webhook: WebhookResponse;
}

export function WebhookCard({
  className,
  webhook,
  ...props
}: WebhookCardProps) {
  const t = useTranslations("Webhook.card");
  const format = useFormatter();

  return (
    <div
      className={cn(
        "group flex w-full flex-col justify-between gap-4 overflow-hidden rounded-md border-b-2 p-4 last:border-0 hover:bg-muted lg:flex-row",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col">
        <p className="break-all font-semibold">{webhook.name}</p>
        <p className="text-muted-foreground">
          {t.rich("scope", {
            actionsCount: webhook.scope.length,
            semibold: (chunks) => (
              <span className="font-semibold">{chunks}</span>
            ),
          })}
        </p>
        <p className="text-muted-foreground">
          {t.rich("type", {
            type: webhook.type,
            semibold: (chunks) => (
              <span className="font-semibold capitalize">{chunks}</span>
            ),
          })}
        </p>
        <p className="text-muted-foreground">
          {t.rich("created_at", {
            date: format.dateTime(webhook.createdAt * 1000, {
              dateStyle: "medium",
              timeStyle: "medium",
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }),
            semibold: (chunks) => (
              <span className="font-semibold">{chunks}</span>
            ),
          })}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="w-fit whitespace-nowrap rounded-md border group-hover:border-input max-sm:self-end lg:border-card">
          <WebhookUpdateDialog webhook={webhook}>
            <Button
              variant="outline"
              size="icon"
              className="rounded-r-none border-0 shadow-none"
            >
              <SquarePen />
            </Button>
          </WebhookUpdateDialog>
          <WebhookTestAlertDialog id={webhook.id}>
            <Button
              variant="outline"
              size="icon"
              className="not-group-hover:hidden rounded-none border-0 border-x shadow-none group-hover:visible lg:invisible"
            >
              <FlaskConical />
            </Button>
          </WebhookTestAlertDialog>
          <WebhookDeleteAlertDialog id={webhook.id}>
            <Button
              variant="outline"
              size="icon"
              className="rounded-l-none border-0 !text-destructive shadow-none group-hover:visible lg:invisible"
            >
              <Trash />
            </Button>
          </WebhookDeleteAlertDialog>
        </div>
      </div>
    </div>
  );
}

export function WebhookCardSkeleton({
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
        <Skeleton className="h-5 w-full max-w-40" />
        <Skeleton className="h-5 w-full max-w-28" />
        <Skeleton className="h-5 w-full max-w-64" />
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:justify-end">
        <Skeleton className="h-9 w-[6.75rem]" />
      </div>
    </div>
  );
}
