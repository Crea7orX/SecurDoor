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
import { useUpdateAccessDeviceMutation } from "@/hooks/api/access/devices/use-update-access-device-mutation";
import { useGetAllCardsQuery } from "@/hooks/api/cards/use-get-all-cards-query";
import { useI18nZodErrors } from "@/hooks/use-i18n-zod-errors";
import { arraysEquals } from "@/lib/utils";
import {
  type AccessDeviceResponse,
  type AccessDeviceUpdate,
  accessDeviceUpdateSchema,
} from "@/lib/validations/access";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AccessDevicesEditDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  id: string;
  cards: Pick<AccessDeviceResponse, "cards">["cards"];
}

export function AccessDevicesEditDialog({
  children,
  id,
  cards,
  ...props
}: AccessDevicesEditDialogProps) {
  const t = useTranslations("Device");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);

  const { data, isLoading: isLoadingData } = useGetAllCardsQuery({
    searchParams: {
      perPage: "50", // todo: maybe pagination
      sort: '[{"id":"holder","desc":false},{"id":"fingerprint","desc":false},{"id":"createdAt","desc":false}]',
    },
    enabled: isOpen,
  });
  const cardOptions: MultiSelectOption[] | undefined = React.useMemo(() => {
    return data?.data.map((card) => {
      return {
        label: t("access.dialog.card", {
          holder: card.holder ?? "",
          fingerprint: card.fingerprint.slice(-8),
        }),
        value:
          ((card.holder && card.holder + "-") ?? "") +
          card.fingerprint +
          "-" +
          card.id,
        key: card.id,
      };
    });
  }, [data, t]);

  const { mutateAsync: update } = useUpdateAccessDeviceMutation({
    id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  useI18nZodErrors();
  const form = useForm<AccessDeviceUpdate>({
    resolver: zodResolver(accessDeviceUpdateSchema),
    defaultValues: {
      cards: cards.map((card) => card.id),
    },
    disabled: isLoading,
  });
  form.watch("cards");

  // Set cards value on cards update
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    form.setValue(
      "cards",
      cards.map((card) => card.id),
    );
  }, [cards]);

  const resetForm = () => {
    form.reset();
    form.setValue(
      "cards",
      cards.map((card) => card.id),
    );
  };

  const onSubmit = async (data: AccessDeviceUpdate) => {
    if (
      arraysEquals(
        cards.map((card) => card.id),
        data.cards,
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
              name="cards"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field.cards.label")}</FormLabel>
                  {isLoadingData ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <FormControl>
                      <MultiSelect
                        {...field}
                        options={cardOptions ?? []}
                        value={cardOptions?.filter((option) =>
                          field.value.includes(option.key),
                        )}
                        onChange={(options) => {
                          field.onChange(options.map((option) => option.key));
                        }}
                        placeholder={t("field.cards.placeholder")}
                        heading={t("field.cards.label")}
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
                    cards.map((card) => card.id).sort(),
                    form.getValues("cards").sort(),
                  )
                }
              >
                {tButton("reset")}
              </Button>
              <Button
                disabled={
                  isLoading ||
                  arraysEquals(
                    cards.map((card) => card.id).sort(),
                    form.getValues("cards").sort(),
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
