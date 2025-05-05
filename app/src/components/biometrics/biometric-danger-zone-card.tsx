"use client";

import { ConfirmAlertDialog } from "@/components/common/confirm-alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDeleteBiometricMutation } from "@/hooks/api/biometrics/use-delete-biometric-mutation";
import { Trash, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import * as React from "react";

interface BiometricDangerZoneCardProps
  extends React.ComponentProps<typeof Card> {
  id: string;
}

export function BiometricDangerZoneCard({
  className,
  id,
  ...props
}: BiometricDangerZoneCardProps) {
  const t = useTranslations("Biometric");
  const tButton = useTranslations("Common.button");

  const router = useRouter();
  const { mutateAsync: doDelete } = useDeleteBiometricMutation({
    id: id,
  });

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1 text-destructive">
          <TriangleAlert className="size-6" />
          <span>{t("danger_zone.title")}</span>
        </CardTitle>
        <CardDescription>{t("danger_zone.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-stretch gap-2 max-md:flex-col">
        <ConfirmAlertDialog
          onConfirm={doDelete}
          onSuccess={() => router.push("/dashboard/biometrics")}
          namespace="Biometric.delete.alert"
          confirmButtonText="remove"
          confirmButtonVariant="destructive"
        >
          <Button variant="destructive">
            <Trash />
            <span>{tButton("remove")}</span>
          </Button>
        </ConfirmAlertDialog>
      </CardContent>
    </Card>
  );
}
