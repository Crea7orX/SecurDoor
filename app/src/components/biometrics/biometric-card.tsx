"use client";

import { BiometricActivateButton } from "@/components/biometrics/access/biometric-activate-button";
import { BiometricDisableButton } from "@/components/biometrics/access/biometric-disable-button";
import { BiometricStatusBadge } from "@/components/biometrics/access/biometric-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { BiometricResponse } from "@/lib/validations/biometric";
import { Settings, ShieldQuestion, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

interface BiometricCardProps extends React.ComponentProps<typeof Card> {
  biometric: BiometricResponse;
}

export function BiometricCard({
  className,
  biometric,
  ...props
}: BiometricCardProps) {
  const t = useTranslations("Biometric");
  const tButton = useTranslations("Common.button");

  return (
    <Card
      className={cn(
        "w-full max-w-[360px] bg-border lg:min-w-[360px]",
        className,
      )}
      {...props}
    >
      <CardHeader className="items-center gap-2 space-y-0 md:flex-row">
        <CardTitle>
          {t.rich("card.title", {
            id: biometric.id.slice(-8),
            semibold: (chunks) => (
              <span className="font-semibold">{chunks}</span>
            ),
          })}
        </CardTitle>
        <Separator
          orientation="vertical"
          className="h-6 bg-card-foreground max-md:hidden"
        />
        <BiometricStatusBadge active={biometric.active} />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 rounded-xl bg-card pt-2">
        <div className="flex flex-col gap-2">
          <Label className="text-md">{t("field.individual.label")}</Label>
          {biometric.individual ? (
            <Badge variant="info" className="text-md gap-1">
              <User className="shrink-0" />
              <span>{biometric.individual}</span>
            </Badge>
          ) : (
            <Badge variant="warning" className="text-md gap-1">
              <ShieldQuestion className="shrink-0" />
              <span>{t("field.individual.unknown")}</span>
            </Badge>
          )}
        </div>
        <Separator className="h-1 rounded-xl" />
        <div className="flex flex-wrap gap-2">
          <Button className="flex-1" asChild>
            <Link href={`/dashboard/biometrics/${biometric.id}`}>
              <Settings className="size-4" />
              {tButton("settings")}
            </Link>
          </Button>
          {biometric.active ? (
            <BiometricDisableButton className="flex-1" id={biometric.id} />
          ) : (
            <BiometricActivateButton className="flex-1" id={biometric.id} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function BiometricCardSkeleton({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "w-full max-w-[360px] bg-border md:min-w-[360px]",
        className,
      )}
      {...props}
    >
      <CardHeader className="items-center gap-2 space-y-0 md:flex-row">
        <Skeleton className="h-6 w-full max-w-40" />
        <Separator
          orientation="vertical"
          className="h-6 bg-card-foreground max-md:hidden"
        />
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 rounded-xl bg-card pt-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-full max-w-32" />
          <Skeleton className="h-8" />
        </div>
        <Separator className="h-1 rounded-xl" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 min-w-40 flex-1" />
          <Skeleton className="h-9 min-w-24 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}
