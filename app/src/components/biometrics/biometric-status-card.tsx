"use client";

import { BiometricActivateButton } from "@/components/biometrics/access/biometric-activate-button";
import { BiometricDisableButton } from "@/components/biometrics/access/biometric-disable-button";
import { BiometricStatusBadge } from "@/components/biometrics/access/biometric-status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { BiometricResponse } from "@/lib/validations/biometric";
import { Hand } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface BiometricStatusCardProps extends React.ComponentProps<typeof Card> {
  biometric: BiometricResponse;
}

export function BiometricStatusCard({
  className,
  biometric,
  ...props
}: BiometricStatusCardProps) {
  const t = useTranslations("Biometric.status");

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1">
          <Hand className="size-6" />
          <span>{t("title")}</span>
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <BiometricStatusBadge className="text-md" active={biometric.active} />
        <Separator className="mt-6 h-1 rounded-xl" />
      </CardContent>
      <CardFooter className="justify-end gap-2 max-md:flex-col">
        {biometric.active ? (
          <BiometricDisableButton className="max-md:w-full" id={biometric.id} />
        ) : (
          <BiometricActivateButton
            className="max-md:w-full"
            id={biometric.id}
          />
        )}
      </CardFooter>
    </Card>
  );
}
