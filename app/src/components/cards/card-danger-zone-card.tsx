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
  const router = useRouter();

  const { mutateAsync: doDelete } = useDeleteCardMutation({
    id: id,
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Deleting card...");
    await doDelete()
      .then(() => {
        toast.warning("Card deleted successfully!", {
          id: toastId,
        });

        setIsOpen(false);
        router.push("/dashboard/cards");
      })
      .catch(() => {
        toast.error("Failed to delete card!", {
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
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>
            Dangerous actions that can not be undone
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-stretch gap-2 max-md:flex-col">
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={() => setIsOpen(true)}
          >
            <Trash />
            <span>Remove</span>
          </Button>
        </CardContent>
      </Card>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              card and remove its access to all doors.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <Button disabled={isLoading} onClick={() => handleDelete()}>
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});
CardDangerZoneCard.displayName = "CardDangerZoneCard";

export { CardDangerZoneCard };
