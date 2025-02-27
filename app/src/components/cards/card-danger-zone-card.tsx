"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDeleteCardMutation } from "@/hooks/api/cards/use-delete-card-mutation";
import { Trash, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

interface CardDangerZoneCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const CardDangerZoneCard = React.forwardRef<
  HTMLDivElement,
  CardDangerZoneCardProps
>(({ className, id, ...props }, ref) => {
  const t = useTranslations("Card");
  const tButton = useTranslations("Common.button");

  const router = useRouter();

  const { mutateAsync: doDelete } = useDeleteCardMutation({
    id: id,
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const toastId = toast.loading(t("delete.notification.loading"));
    await doDelete()
      .then(() => {
        toast.warning(t("delete.alert.notification.success"), {
          id: toastId,
        });

        setIsOpen(false);
        router.push("/dashboard/cards");
      })
      .catch(() => {
        toast.error(t("delete.alert.notification.error"), {
          id: toastId,
        });
      });

    setIsLoading(false);
  };

  return (
    <>
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1 text-destructive">
            <TriangleAlert className="size-6" />
            <span>{t("danger_zone.title")}</span>
          </CardTitle>
          <CardDescription>{t("danger_zone.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-stretch gap-2 max-md:flex-col">
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={() => setIsOpen(true)}
          >
            <Trash />
            <span>{tButton("remove")}</span>
          </Button>
        </CardContent>
      </Card>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete.alert.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete.alert.description")}
            </AlertDialogDescription>
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
    </>
  );
});
CardDangerZoneCard.displayName = "CardDangerZoneCard";

export { CardDangerZoneCard };
