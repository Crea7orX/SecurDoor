"use client";

import { CardAddDeviceCombobox } from "@/components/cards/add/card-add-device-combobox";
import {
  CardAddLogButton,
  CardAddLogButtonSkeleton,
} from "@/components/cards/add/card-add-log-button";
import { NoResultsLabel } from "@/components/data-table/no-results-label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useGetAllLogsQuery } from "@/hooks/api/logs/use-get-all-logs-query";
import type { DeviceResponse } from "@/lib/validations/device";
import type { SearchParams } from "@/types/data-table";
import * as React from "react";

interface CardAddSelectDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  value?: string;
  onChange?: (value: string) => void;
}

export function CardAddSelectDialog({
  children,
  value = "",
  onChange,
  ...props
}: CardAddSelectDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const [device, setDevice] = React.useState<DeviceResponse>();
  const [cardFingerprint, _setCardFingerprint] = React.useState<string>(value);

  const searchParams: SearchParams = React.useMemo(
    () => ({
      perPage: "3",
      action: "device.access_denied",
      ...(device && { objectId: device.id }),
    }),
    [device],
  );
  const {
    data: logs,
    isLoading: isLoadingLogs,
    isPlaceholderData,
  } = useGetAllLogsQuery({
    searchParams,
    refetchInterval: 5000,
    enabled: !!device && isOpen,
  });

  // Update card fingerprint on value change
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    _setCardFingerprint(value);
  }, [value]);

  // Update value for form
  const setCardFingerprint = React.useCallback(
    (fingerprint: string) => {
      _setCardFingerprint(fingerprint);
      onChange?.(fingerprint);
    },
    [onChange],
  );

  return (
    <Dialog {...props} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select card</DialogTitle>
          <DialogDescription>
            Select the device from which you want to scan the card. Then place
            the card on the reader. After that you will see the recent attempt
            to unlock the device from which you can select the wanted card to
            add.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Device</Label>
          <CardAddDeviceCombobox
            selectedDevice={device}
            setSelectedDevice={setDevice}
            enabledQuery={isOpen}
          />
        </div>

        {device && (
          <div className="relative space-y-2">
            <Label>Recent access attempts</Label>
            {isLoadingLogs || isPlaceholderData ? (
              Array.from({ length: 3 }).map((_, index) => (
                <CardAddLogButtonSkeleton key={index} />
              ))
            ) : logs && logs.data.length > 0 ? (
              logs.data.map((log) => (
                <CardAddLogButton
                  key={log.id}
                  cardFingerprint={cardFingerprint}
                  setCardFingerprint={setCardFingerprint}
                  log={log}
                />
              ))
            ) : (
              <>
                <NoResultsLabel className="left-1/2 top-1/4 -translate-x-1/2 translate-y-1/4" />
                {Array.from({ length: 3 }).map((_, index) => (
                  <CardAddLogButtonSkeleton key={index} />
                ))}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
