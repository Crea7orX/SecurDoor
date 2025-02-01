"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { InputInline } from "@/components/ui/input-inline";
import { useUpdateCardMutation } from "@/hooks/api/cards/use-update-card-mutation";
import {
  type CardResponse,
  type CardUpdate,
  cardUpdateSchema,
} from "@/lib/validations/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CardHolderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: CardResponse;
}

const CardHolderCard = React.forwardRef<HTMLDivElement, CardHolderCardProps>(
  ({ className, card, ...props }, ref) => {
    const { mutateAsync: update } = useUpdateCardMutation({
      id: card.id,
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<CardUpdate>({
      resolver: zodResolver(cardUpdateSchema),
      defaultValues: {
        holder: card.holder ?? "",
      },
    });

    React.useEffect(() => {
      if (!card) return;
      form.setValue("holder", card.holder ?? "", {
        shouldValidate: true,
      });
    }, [form, card]);

    const resetForm = () => {
      form.setValue("holder", card.holder ?? "", {
        shouldValidate: true,
      });
    };

    const handleUpdate = async (value: string) => {
      if (value === card.holder || (value === "" && !card.holder)) return;
      if (!form.formState.isValid) return resetForm();

      setIsLoading(true);
      const toastId = toast.loading("Renaming card...");
      await update({
        holder: value,
      })
        .then(() => {
          toast.success("Card renamed!", {
            id: toastId,
          });
        })
        .catch(() => {
          resetForm(); // Reset to original value

          toast.error("Failed to rename card!", {
            id: toastId,
          });
        });

      setIsLoading(false);
    };

    return (
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <User className="size-6" />
            <span>Holder</span>
          </CardTitle>
          <CardDescription>Holder of the card</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="holder"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <InputInline
                        className="bg-secondary text-secondary-foreground"
                        placeholder={!card.holder ? "Unknown" : "Holder"}
                        disabled={isLoading}
                        onUpdate={handleUpdate}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  },
);
CardHolderCard.displayName = "CardHolderCard";

export { CardHolderCard };
