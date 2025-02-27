"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useUpdateEmergencyClearMutation } from "@/hooks/api/emergency/use-update-emergency-clear-mutation";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

interface DeviceEmergencyClearAlertDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  id: string;
}

export function DeviceEmergencyClearAlertDialog({
  id,
  children,
  ...props
}: DeviceEmergencyClearAlertDialogProps) {
  const t = useTranslations("Device.emergency.clear");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);

  const { mutateAsync: update } = useUpdateEmergencyClearMutation({
    id: id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    const toastId = toast.loading(t("notification.loading"));
    await update()
      .then(() => {
        toast.info(t("notification.success"), {
          id: toastId,
        });

        setIsOpen(false);
      })
      .catch(() => {
        toast.error(t("notification.error"), {
          id: toastId,
        });
      });

    setIsLoading(false);
  };

  return (
    <AlertDialog {...props} open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("alert.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("alert.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {tButton("cancel")}
          </AlertDialogCancel>
          <Button disabled={isLoading} onClick={() => handleUpdate()}>
            {tButton("continue")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
