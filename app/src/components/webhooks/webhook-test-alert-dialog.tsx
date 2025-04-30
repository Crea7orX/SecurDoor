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
import { useTestWebhookMutation } from "@/hooks/api/webhooks/use-test-webhook-mutation";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

interface WebhookTestAlertDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  id: string;
}

export function WebhookTestAlertDialog({
  id,
  children,
  ...props
}: WebhookTestAlertDialogProps) {
  const t = useTranslations("Webhook.test.alert");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);

  const { mutateAsync: test } = useTestWebhookMutation({
    id: id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    const toastId = toast.loading(t("notification.loading"));
    await test()
      .then(() => {
        toast.success(t("notification.success"), {
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
          <Button disabled={isLoading} onClick={() => handleTest()}>
            {tButton("continue")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
