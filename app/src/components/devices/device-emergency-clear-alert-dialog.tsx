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
  const [isOpen, setIsOpen] = React.useState(false);

  const { mutateAsync: update } = useUpdateEmergencyClearMutation({
    id: id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Clearing emergency state...");
    await update()
      .then(() => {
        toast.info("Emergency state cleared successfully!", {
          id: toastId,
        });

        setIsOpen(false);
      })
      .catch(() => {
        toast.error("Failed to clear emergency state!", {
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
            This will return the device to normal mode.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button disabled={isLoading} onClick={() => handleUpdate()}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
