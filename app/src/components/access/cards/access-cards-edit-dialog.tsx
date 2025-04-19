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
import { useUpdateCardTagsMutation } from "@/hooks/api/cards/tags/use-update-card-tags-mutation";
import { useGetAllDevicesQuery } from "@/hooks/api/devices/use-get-all-devices-query";
import { useGetAllTagsQuery } from "@/hooks/api/tags/use-get-all-tags-query";
import { useI18nZodErrors } from "@/hooks/use-i18n-zod-errors";
import { arraysEquals } from "@/lib/utils";
import {
  type AccessCardResponse,
  type AccessCardUpdate,
  accessCardUpdateSchema,
} from "@/lib/validations/access";
import {
  type CardTagsResponse,
  type CardTagsUpdate,
  cardTagsUpdateSchema,
} from "@/lib/validations/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AccessCardsEditDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  id: string;
  devices: Pick<AccessCardResponse, "devices">["devices"];
  tags: Pick<CardTagsResponse, "tags">["tags"];
}

export function AccessCardsEditDialog({
  children,
  id,
  devices,
  tags,
  ...props
}: AccessCardsEditDialogProps) {
  const t = useTranslations("Card");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);

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
        label: t("access.dialog.tag", {
          name: tag.name,
        }),
        value: tag.name + "-" + tag.id,
        key: tag.id,
      };
    });
  }, [tagsData, t]);

  const { mutateAsync: accessUpdate } = useUpdateAccessCardMutation({
    id,
  });
  const { mutateAsync: tagsUpdate } = useUpdateCardTagsMutation({
    id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  useI18nZodErrors();
  const form = useForm<AccessCardUpdate & CardTagsUpdate>({
    resolver: zodResolver(
      accessCardUpdateSchema.extend(cardTagsUpdateSchema.shape),
    ),
    defaultValues: {
      devices: devices.map((device) => device.id),
      tags: tags.map((tag) => tag.id),
    },
    disabled: isLoading,
  });
  form.watch("devices");
  form.watch("tags");

  // Set devices value on devices update
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    form.setValue(
      "devices",
      devices.map((device) => device.id),
    );
  }, [devices]);

  // Set tags value on tags update
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    form.setValue(
      "tags",
      tags.map((tag) => tag.id),
    );
  }, [tags]);

  const resetForm = () => {
    form.reset();
    form.setValue(
      "devices",
      devices.map((device) => device.id),
    );
    form.setValue(
      "tags",
      tags.map((tag) => tag.id),
    );
  };

  const sameDevicesSelected = arraysEquals(
    devices.map((device) => device.id).sort(),
    form.getValues("devices").sort(),
  );
  const sameTagsSelected = arraysEquals(
    tags.map((tag) => tag.id).sort(),
    form.getValues("tags").sort(),
  );

  const onSubmit = async (data: AccessCardUpdate & CardTagsUpdate) => {
    if (sameDevicesSelected && sameTagsSelected) return;

    setIsLoading(true);
    const toastId = toast.loading(t("access.dialog.notification.loading"));
    await Promise.all([
      !sameDevicesSelected && accessUpdate({ devices: data.devices }),
      !sameTagsSelected && tagsUpdate({ tags: data.tags }),
    ])
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
              name="tags"
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
            <DialogFooter className="gap-y-2">
              <Button
                variant="outline"
                type="button"
                onClick={resetForm}
                disabled={
                  isLoading || (sameDevicesSelected && sameTagsSelected)
                }
              >
                {tButton("reset")}
              </Button>
              <Button
                disabled={
                  isLoading ||
                  (arraysEquals(
                    devices.map((device) => device.id).sort(),
                    form.getValues("devices").sort(),
                  ) &&
                    arraysEquals(
                      tags.map((tag) => tag.id).sort(),
                      form.getValues("tags").sort(),
                    ))
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
