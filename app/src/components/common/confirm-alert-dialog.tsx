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
import { Button, type ButtonProps } from "@/components/ui/button";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

interface ConfirmAlertDialogProps
  extends React.ComponentProps<typeof AlertDialog> {
  onConfirm: UseMutateAsyncFunction;
  onSuccess?: () => void;
  namespace?: string;
  confirmNamespace?: string;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  confirmButtonVariant?: ButtonProps["variant"];
}

export function ConfirmAlertDialog({
  onConfirm,
  onSuccess,
  namespace = "",
  confirmNamespace = "Common.button",
  title = "title",
  description = "description",
  confirmButtonText = "continue",
  confirmButtonVariant = "default",
  children,
  ...props
}: ConfirmAlertDialogProps) {
  const t = useTranslations(namespace);
  const tButton = useTranslations("Common.button");
  const tConfirm = useTranslations(confirmNamespace);

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const toastId = toast.loading(t("notification.loading"));
    await onConfirm()
      .then(() => {
        toast.warning(t("notification.success"), {
          id: toastId,
        });

        setIsOpen(false);
        onSuccess?.();
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
          <AlertDialogTitle>{t(title)}</AlertDialogTitle>
          <AlertDialogDescription>{t(description)}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {tButton("cancel")}
          </AlertDialogCancel>
          <Button
            variant={confirmButtonVariant}
            disabled={isLoading}
            onClick={handleDelete}
          >
            {tConfirm(confirmButtonText)}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
