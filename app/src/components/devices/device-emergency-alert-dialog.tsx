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
import { useUpdateEmergencyMutation } from "@/hooks/api/emergency/use-update-emergency-mutation";
import { type emergencyUpdateSchema } from "@/lib/validations/emergency";
import * as React from "react";
import { toast } from "sonner";

interface DeviceEmergencyAlertDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  id: string;
  state: (typeof emergencyUpdateSchema.shape.state.options)[number];
}

export function DeviceEmergencyAlertDialog({
  id,
  state,
  children,
  ...props
}: DeviceEmergencyAlertDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const { mutateAsync: update } = useUpdateEmergencyMutation({
    id: id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Updating emergency state...");
    await update({
      state,
    })
      .then(() => {
        toast.warning("Emergency state updated successfully!", {
          id: toastId,
        });

        setIsOpen(false);
      })
      .catch(() => {
        toast.error("Failed to update emergency state!", {
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
            This will put the device in emergency mode ({state}). This will{" "}
            {state === "lockdown" ? "lock" : "unlock"} the door and you will
            need to clear the emergency state manually in order to return to
            normal mode.
            {/*todo*/}
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
