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
import { useSetDevicePendingCommandMutation } from "@/hooks/api/devices/command/use-set-device-pending-command-mutation";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

interface DeviceRestartAlertDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  id: string;
}

export function DeviceRestartAlertDialog({
  id,
  children,
  ...props
}: DeviceRestartAlertDialogProps) {
  const t = useTranslations("Device.restart.alert");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);

  const { mutateAsync: restart } = useSetDevicePendingCommandMutation({
    id: id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRestart = async () => {
    setIsLoading(true);
    const toastId = toast.loading(t("notification.loading"));
    await restart({ pendingCommand: "restart" })
      .then(() => {
        toast.warning(t("notification.success"), {
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
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {tButton("cancel")}
          </AlertDialogCancel>
          <Button disabled={isLoading} onClick={() => handleRestart()}>
            {tButton("continue")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
