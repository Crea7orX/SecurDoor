"use client";

import { ConfirmAlertDialog } from "@/components/common/confirm-alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSetDevicePendingCommandMutation } from "@/hooks/api/devices/command/use-set-device-pending-command-mutation";
import { useGetAllDevicesQuery } from "@/hooks/api/devices/use-get-all-devices-query";
import { useTranslations } from "next-intl";
import * as React from "react";

export function BiometricAddDialog({
  children,
  ...props
}: React.ComponentProps<typeof Dialog>) {
  const t = useTranslations("Biometric");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);
  const [deviceId, setDeviceId] = React.useState<string | undefined>(undefined);

  const { data: devicesData, isLoading: devicesIsLoading } =
    useGetAllDevicesQuery({
      searchParams: {
        perPage: "50", // todo: maybe pagination
        sort: '[{"id":"name","desc":false},{"id":"createdAt","desc":false}]',
      },
      enabled: isOpen,
    });

  const { mutateAsync: registerFingeprint } =
    useSetDevicePendingCommandMutation({
      id: deviceId ?? "",
    });

  return (
    <Dialog {...props} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("add.title")}</DialogTitle>
        </DialogHeader>
        <Label>{t("field.device.label")}</Label>
        {devicesIsLoading || !devicesData ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select value={deviceId} onValueChange={setDeviceId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {devicesData.data.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <p className="text-[0.8rem] text-muted-foreground">
          {t("field.device.description")}
        </p>
        <DialogFooter className="gap-y-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            {tButton("cancel")}
          </Button>
          <ConfirmAlertDialog
            onConfirm={() =>
              registerFingeprint({ pendingCommand: "register_biometric" })
            }
            onSuccess={() => setIsOpen(false)}
            namespace="Biometric.add.confirm"
            confirmButtonText="submit"
            confirmButtonVariant="warning"
          >
            <Button disabled={!deviceId}>{tButton("continue")}</Button>
          </ConfirmAlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
