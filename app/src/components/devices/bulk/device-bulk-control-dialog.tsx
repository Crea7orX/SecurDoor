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
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllDevicesQuery } from "@/hooks/api/devices/use-get-all-devices-query";
import { useBulkEmergencyClearMutation } from "@/hooks/api/emergency/use-bulk-update-emergency-clear-mutation";
import { useBulkUpdateEmergencyMutation } from "@/hooks/api/emergency/use-bulk-update-emergency-mutation";
import { useGetAllTagsQuery } from "@/hooks/api/tags/use-get-all-tags-query";
import { useI18nZodErrors } from "@/hooks/use-i18n-zod-errors";
import { type DeviceBulk, deviceBulkSchema } from "@/lib/validations/device";
import { type TagBulk, tagBulkSchema } from "@/lib/validations/tag";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, BellElectric, Construction } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const actions = [
  {
    label: "action.emergency.label",
    actions: [
      {
        label: "action.emergency.lockdown",
        value: "lockdown",
        icon: Construction,
        iconClassName: "text-destructive",
      },
      {
        label: "action.emergency.evacuation",
        value: "evacuation",
        icon: BellElectric,
        iconClassName: "text-warning",
      },
      {
        label: "action.emergency.clear",
        value: "clear",
        icon: Activity,
        iconClassName: "text-info",
      },
    ],
  },
];

export function DeviceBulkControlDialog({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog>) {
  const t = useTranslations("Device");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);
  const [action, setAction] = React.useState("lockdown");

  const { data: devicesData, isLoading: devicesIsLoading } =
    useGetAllDevicesQuery({
      searchParams: {
        perPage: "50", // todo: maybe pagination
        sort: '[{"id":"name","desc":false},{"id":"createdAt","desc":false}]',
      },
      enabled: isOpen,
    });
  const deviceOptions: MultiSelectOption[] | undefined = React.useMemo(() => {
    return devicesData?.data.map((device) => {
      return {
        label: device.name,
        value: device.name + "-" + device.id,
        key: device.id,
      };
    });
  }, [devicesData]);

  const { data: tagsData, isLoading: tagsIsLoading } = useGetAllTagsQuery({
    searchParams: {
      perPage: "50", // todo: maybe pagination
      sort: '[{"id":"name","desc":false},{"id":"createdAt","desc":false}]',
    },
    enabled: isOpen,
  });
  const tagOptions: MultiSelectOption[] | undefined = React.useMemo(() => {
    return tagsData?.data.map((tag) => {
      return {
        label: t("field.tags.option", {
          name: tag.name,
          devicesCount: tag.devicesCount,
        }),
        value: tag.name + "-" + tag.id,
        key: tag.id,
      };
    });
  }, [tagsData, t]);

  const { mutateAsync: updateEmergencyMutation } =
    useBulkUpdateEmergencyMutation();
  const { mutateAsync: clearEmergencyMutation } =
    useBulkEmergencyClearMutation();
  const [isLoading, setIsLoading] = React.useState(false);

  useI18nZodErrors();
  const form = useForm<DeviceBulk & TagBulk>({
    resolver: zodResolver(deviceBulkSchema.extend(tagBulkSchema.shape)),
    defaultValues: {
      deviceIds: [],
      tagIds: [],
    },
    disabled: isLoading,
  });

  const update = async (data: DeviceBulk & TagBulk) => {
    if (action === "lockdown" || action === "evacuation") {
      return updateEmergencyMutation({
        state: action,
        deviceIds: data.deviceIds,
        tagIds: data.tagIds,
      });
    }

    if (action === "clear") {
      return clearEmergencyMutation(data);
    }

    return Promise.resolve();
  };

  const onSubmit = async (data: DeviceBulk & TagBulk) => {
    setIsLoading(true);
    const toastId = toast.loading(t("bulk.dialog.notification.loading"));
    await update(data)
      .then(() => {
        toast.success(t("bulk.dialog.notification.success"), {
          id: toastId,
        });

        setIsOpen(false);
      })
      .catch(() => {
        toast.error(t("bulk.dialog.notification.error"), {
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
              <DialogTitle>{t("bulk.dialog.title")}</DialogTitle>
              <DialogDescription>
                {t("bulk.dialog.description")}
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="deviceIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field.devices.label")}</FormLabel>
                  {devicesIsLoading ? (
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
            <FormField
              control={form.control}
              name="tagIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field.tags.label")}</FormLabel>
                  {tagsIsLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <FormControl>
                      <MultiSelect
                        {...field}
                        options={tagOptions ?? []}
                        value={tagOptions?.filter((option) =>
                          field.value.includes(option.key),
                        )}
                        onChange={(options) => {
                          field.onChange(options.map((option) => option.key));
                        }}
                        placeholder={t("field.tags.placeholder")}
                        heading={t("field.tags.label")}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>{t("field.action.label")}</FormLabel>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actions.map((group, index) => (
                    <SelectGroup key={index}>
                      <SelectLabel>{t(`bulk.${group.label}`)}</SelectLabel>
                      {group.actions.map((action) => (
                        <SelectItem
                          key={action.value}
                          value={action.value}
                          icon={action.icon}
                          iconClassName={action.iconClassName}
                        >
                          {t(`bulk.${action.label}`)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>{t("field.action.description")}</FormDescription>
            </FormItem>
            <DialogFooter className="gap-y-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                {tButton("cancel")}
              </Button>
              <Button
                disabled={
                  isLoading ||
                  !(
                    form.getValues("deviceIds").length > 0 ||
                    form.getValues("tagIds").length > 0
                  )
                }
              >
                {tButton("submit")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
