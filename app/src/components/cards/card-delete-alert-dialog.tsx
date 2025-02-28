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
import { useDeleteCardMutation } from "@/hooks/api/cards/use-delete-card-mutation";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

interface CardDeleteAlertDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  id: string;
}

export function CardDeleteAlertDialog({
  id,
  children,
  ...props
}: CardDeleteAlertDialogProps) {
  const t = useTranslations("Card.delete.alert");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();

  const { mutateAsync: doDelete } = useDeleteCardMutation({
    id: id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const toastId = toast.loading(t("notification.loading"));
    await doDelete()
      .then(() => {
        toast.warning(t("notification.success"), {
          id: toastId,
        });

        setIsOpen(false);
        router.push("/dashboard/cards");
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
          <Button disabled={isLoading} onClick={() => handleDelete()}>
            {tButton("continue")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
