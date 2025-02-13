"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateDeviceMutation } from "@/hooks/api/devices/use-update-device-mutation";
import {
  type DeviceResponse,
  type DeviceUpdate,
  deviceUpdateSchema,
} from "@/lib/validations/device";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface DeviceSettingsDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  device: DeviceResponse;
}

export function DeviceSettingsDialog({
  children,
  device,
  ...props
}: DeviceSettingsDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const { mutateAsync: update } = useUpdateDeviceMutation({
    id: device.id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<DeviceUpdate>({
    resolver: zodResolver(deviceUpdateSchema),
    defaultValues: {
      name: device.name,
      reLockDelay: device.reLockDelay,
    },
    disabled: isLoading,
  });

  // Set default values on device update
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    form.reset(
      {
        name: device.name,
        reLockDelay: device.reLockDelay,
      },
      {
        keepValues: true,
      },
    );
  }, [device]);

  const resetForm = () => {
    form.reset();
  };

  const onSubmit = async (data: DeviceUpdate) => {
    if (!form.formState.isDirty) return;

    // Filter only dirty fields
    const dirtyFields = form.formState.dirtyFields;
    const updatedData = Object.keys(dirtyFields).reduce((acc, key) => {
      if (dirtyFields[key as keyof DeviceUpdate]) {
        return { ...acc, [key]: data[key as keyof DeviceUpdate] };
      }
      return acc;
    }, {});

    setIsLoading(true);
    const toastId = toast.loading("Updating device...");
    await update(updatedData)
      .then(() => {
        toast.success("Device updated!", {
          id: toastId,
        });

        setIsOpen(false);
      })
      .catch(() => {
        toast.error("Failed to update device!", {
          id: toastId,
        });
      });

    setIsLoading(false);
  };

  return (
    <Dialog {...props} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Device</DialogTitle>
              <DialogDescription>Edit device settings</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={
                        deviceUpdateSchema.shape.name.unwrap().maxLength!
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Display name for the device.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reLockDelay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Re-lock delay</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={
                        deviceUpdateSchema.shape.reLockDelay.unwrap().minValue!
                      }
                      max={
                        deviceUpdateSchema.shape.reLockDelay.unwrap().maxValue!
                      }
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Re-lock delay in seconds. 0 to disable auto re-lock.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-y-2">
              <Button
                variant="outline"
                type="button"
                onClick={resetForm}
                disabled={isLoading || !form.formState.isDirty}
              >
                Reset
              </Button>
              <Button disabled={isLoading || !form.formState.isDirty}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
