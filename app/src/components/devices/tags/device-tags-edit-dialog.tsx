"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { useUpdateDeviceTagsMutation } from "@/hooks/api/devices/tags/use-update-device-tags-mutation";
import { useGetAllTagsQuery } from "@/hooks/api/tags/use-get-all-tags-query";
import { useI18nZodErrors } from "@/hooks/use-i18n-zod-errors";
import { arraysEquals } from "@/lib/utils";
import {
  type DeviceTagsResponse,
  type DeviceTagsUpdate,
  deviceTagsUpdateSchema,
} from "@/lib/validations/device";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface DeviceTagsEditDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  id: string;
  tags: Pick<DeviceTagsResponse, "tags">["tags"];
}

export function DeviceTagsEditDialog({
  children,
  id,
  tags,
  ...props
}: DeviceTagsEditDialogProps) {
  const t = useTranslations("Device");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);

  const { data, isLoading: isLoadingData } = useGetAllTagsQuery({
    searchParams: {
      perPage: "50", // todo: maybe pagination
      sort: '[{"id":"name","desc":false},{"id":"createdAt","desc":false}]',
    },
    enabled: isOpen,
  });
  const tagOptions: MultiSelectOption[] | undefined = React.useMemo(() => {
    return data?.data.map((tag) => {
      return {
        label: t("tags.dialog.tag", {
          name: tag.name,
        }),
        value: tag.name + "-" + tag.id,
        key: tag.id,
      };
    });
  }, [data, t]);

  const { mutateAsync: update } = useUpdateDeviceTagsMutation({
    id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  useI18nZodErrors();
  const form = useForm<DeviceTagsUpdate>({
    resolver: zodResolver(deviceTagsUpdateSchema),
    defaultValues: {
      tags: tags.map((tag) => tag.id),
    },
  });
  form.watch("tags");

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
      "tags",
      tags.map((tag) => tag.id),
    );
  };

  const onSubmit = async (data: DeviceTagsUpdate) => {
    if (
      arraysEquals(
        tags.map((tag) => tag.id),
        data.tags,
      )
    )
      return;

    setIsLoading(true);
    const toastId = toast.loading(t("tags.dialog.notification.loading"));
    await update(data)
      .then(() => {
        toast.success(t("tags.dialog.notification.success"), {
          id: toastId,
        });

        setIsOpen(false);
      })
      .catch(() => {
        toast.error(t("tags.dialog.notification.error"), {
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
              <DialogTitle>{t("tags.dialog.title")}</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field.tags.label")}</FormLabel>
                  {isLoadingData ? (
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
                  isLoading ||
                  arraysEquals(
                    tags.map((tag) => tag.id).sort(),
                    form.getValues("tags").sort(),
                  )
                }
              >
                {tButton("reset")}
              </Button>
              <Button
                disabled={
                  isLoading ||
                  arraysEquals(
                    tags.map((tag) => tag.id).sort(),
                    form.getValues("tags").sort(),
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
