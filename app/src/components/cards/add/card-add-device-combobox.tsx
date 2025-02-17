"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllDevicesQuery } from "@/hooks/api/devices/use-get-all-devices-query";
import { cn } from "@/lib/utils";
import { type DeviceResponse } from "@/lib/validations/device";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

interface CardAddDeviceComboboxProps extends ButtonProps {
  selectedDevice: DeviceResponse | undefined;
  setSelectedDevice: (device: DeviceResponse | undefined) => void;
  enabledQuery?: boolean;
  modal?: boolean;
}

const CardAddDeviceCombobox = React.forwardRef<
  HTMLButtonElement,
  CardAddDeviceComboboxProps
>(
  (
    {
      className,
      selectedDevice,
      setSelectedDevice,
      enabledQuery = true,
      modal = true,
      ...props
    },
    ref,
  ) => {
    const { data, isLoading } = useGetAllDevicesQuery({
      searchParams: {
        perPage: "50", // todo: maybe pagination
      },
      enabled: enabledQuery,
    });

    if (isLoading) {
      return <Skeleton className="h-9 w-full" />;
    }

    return (
      <Popover modal={modal}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !selectedDevice && "text-muted-foreground",
              className,
            )}
            ref={ref}
            {...props}
          >
            {selectedDevice?.name ?? "Select device"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search device..." className="h-9" />
            <CommandList>
              <CommandEmpty>No devices found.</CommandEmpty>
              <CommandGroup>
                {data?.data.map((device) => (
                  <CommandItem
                    key={device.id}
                    value={device.name + "-" + device.id}
                    onSelect={() => {
                      setSelectedDevice(device);
                    }}
                  >
                    {device.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        device === selectedDevice ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
CardAddDeviceCombobox.displayName = "CardAddDeviceCombobox";

export { CardAddDeviceCombobox };
