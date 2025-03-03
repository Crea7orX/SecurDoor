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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateAccessCardMutation } from "@/hooks/api/access/cards/use-update-access-card-mutation";
import { useGetAllDevicesQuery } from "@/hooks/api/devices/use-get-all-devices-query";
import { useI18nZodErrors } from "@/hooks/use-i18n-zod-errors";
import { arraysEquals } from "@/lib/utils";
import {
  type AccessCardResponse,
  type AccessCardUpdate,
  accessCardUpdateSchema,
} from "@/lib/validations/access";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AccessCardsEditDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  id: string;
  devices: Pick<AccessCardResponse, "devices">["devices"];
}

export function AccessCardsEditDialog({
  children,
  id,
  devices,
  ...props
}: AccessCardsEditDialogProps) {
  const t = useTranslations("Card");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);

  const { data, isLoading: isLoadingData } = useGetAllDevicesQuery({
    searchParams: {
      perPage: "50", // todo: maybe pagination
    },
    enabled: isOpen,
  });
  const deviceOptions: MultiSelectOption[] | undefined = React.useMemo(() => {
    return data?.data.map((device) => {
      return {
        label: device.name,
        value: device.name + "-" + device.id,
        key: device.id,
      };
    });
  }, [data]);

  const { mutateAsync: update } = useUpdateAccessCardMutation({
    id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  useI18nZodErrors();
  const form = useForm<AccessCardUpdate>({
    resolver: zodResolver(accessCardUpdateSchema),
    defaultValues: {
      devices: devices.map((device) => device.id),
    },
  });
  form.watch("devices");

  // Set devices value on devices update
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    form.setValue(
      "devices",
      devices.map((device) => device.id),
    );
  }, [devices]);

  const resetForm = () => {
    form.reset();
    form.setValue(
      "devices",
      devices.map((device) => device.id),
    );
  };

  const onSubmit = async (data: AccessCardUpdate) => {
    if (
      arraysEquals(
        devices.map((device) => device.id),
        data.devices,
      )
    )
      return;

    setIsLoading(true);
    const toastId = toast.loading(t("access.dialog.notification.loading"));
    await update(data)
      .then(() => {
        toast.success(t("access.dialog.notification.success"), {
          id: toastId,
        });

        setIsOpen(false);
      })
      .catch(() => {
        toast.error(t("access.dialog.notification.error"), {
          id: toastId,
        });
      });

    setIsLoading(false);
  };

  return (
    <Dialog {...props} open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t("access.dialog.title")}</DialogTitle>
              <DialogDescription>
                {t("access.dialog.description")}
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="devices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field.devices.label")}</FormLabel>
                  {isLoadingData ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <FormControl>
                      <MultiSelect
                        {...field}
                        options={deviceOptions ?? []}
                        value={deviceOptions?.filter((option) =>
                          field.value.includes(option.key),
                        )}
                        onChange={(options) => {
                          field.onChange(options.map((option) => option.key));
                        }}
                        placeholder={t("field.devices.placeholder")}
                        heading={t("field.devices.label")}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-y-2">
              <Button
                variant="outline"
                type="button"
                onClick={resetForm}
                disabled={
                  isLoading ||
                  arraysEquals(
                    devices.map((device) => device.id).sort(),
                    form.getValues("devices").sort(),
                  )
                }
              >
                {tButton("reset")}
              </Button>
              <Button
                disabled={
                  isLoading ||
                  arraysEquals(
                    devices.map((device) => device.id).sort(),
                    form.getValues("devices").sort(),
                  )
                }
              >
                {tButton("save_changes")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
