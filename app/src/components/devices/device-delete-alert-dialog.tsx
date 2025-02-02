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
import { useDeleteDeviceMutation } from "@/hooks/api/devices/use-delete-device-mutation";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

interface DeviceDeleteAlertDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  id: string;
}

export function DeviceDeleteAlertDialog({
  id,
  children,
  ...props
}: DeviceDeleteAlertDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();

  const { mutateAsync: doDelete } = useDeleteDeviceMutation({
    id: id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Deleting device...");
    await doDelete()
      .then(() => {
        toast.warning("Device deleted successfully!", {
          id: toastId,
        });

        setIsOpen(false);
        router.push("/dashboard/devices");
      })
      .catch(() => {
        toast.error("Failed to delete device!", {
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
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            device and it will no longer be accessible.
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
  );
}
