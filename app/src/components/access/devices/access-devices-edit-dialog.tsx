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
import { arraysEquals } from "@/lib/utils";
import {
  type AccessDeviceResponse,
  type AccessDeviceUpdate,
  accessDeviceUpdateSchema,
} from "@/lib/validations/access";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const [isOpen, setIsOpen] = React.useState(false);

  const { data, isLoading: isLoadingData } = useGetAllCardsQuery({
    searchParams: {
      perPage: "50", // todo: maybe pagination
    },
    enabled: isOpen,
  });
  const cardOptions: MultiSelectOption[] | undefined = React.useMemo(() => {
    return data?.data.map((card) => {
      return {
        label: `${card.holder ?? ""} (FID: ${card.fingerprint.slice(-8)})`,
        value:
          ((card.holder && card.holder + "-") ?? "") +
          card.fingerprint +
          "-" +
          card.id,
        key: card.id,
      };
    });
  }, [data]);

  const { mutateAsync: update } = useUpdateAccessDeviceMutation({
    id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<AccessDeviceUpdate>({
    resolver: zodResolver(accessDeviceUpdateSchema),
    defaultValues: {
      cards: cards.map((card) => card.id),
    },
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
    const toastId = toast.loading("Updating access...");
    await update(data)
      .then(() => {
        toast.success("Access updated!", {
          id: toastId,
        });

        setIsOpen(false);
      })
      .catch(() => {
        toast.error("Failed to update access!", {
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
              <DialogTitle>Edit Access</DialogTitle>
              <DialogDescription>
                Select the cards that can be used on the door
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="cards"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cards</FormLabel>
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
                        placeholder="Select cards"
                        heading="Cards"
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
                Reset
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
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
