"use client";

import { CardAddSelectDialog } from "@/components/cards/add/card-add-select-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateCardMutation } from "@/hooks/api/cards/use-create-card-mutation";
import { type CardWithSameFingerprintError } from "@/lib/exceptions";
import { type CardCreate, cardCreateSchema } from "@/lib/validations/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CardsAddPage() {
  const router = useRouter();

  const { mutateAsync: add } = useCreateCardMutation();

  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<CardCreate>({
    resolver: zodResolver(cardCreateSchema),
    defaultValues: {
      fingerprint: "",
      holder: null,
    },
  });

  function onSubmit(data: CardCreate) {
    setIsLoading(true);
    const toastId = toast.loading("Adding Card...");

    add(data)
      .then((data) => {
        toast.success("Card Added!", {
          id: toastId,
        });

        router.push(`/dashboard/cards/${data.data.id}`);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 409) {
            const responseData = error.response
              .data as CardWithSameFingerprintError;

            toast.error("Card already exists!", {
              id: toastId,
              ...(responseData.id && {
                action: (
                  <Button asChild>
                    <Link href={`/dashboard/cards/${responseData.id}`}>
                      View card
                    </Link>
                  </Button>
                ),
              }),
            });
            return;
          }
        }

        toast.error("Failed to add card!", {
          id: toastId,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <Button className="md:self-start" disabled={isLoading} asChild>
        <Link href="/dashboard/cards">
          <ArrowLeft className="size-4" />
          Go Back
        </Link>
      </Button>
      <Card className="bg-border lg:min-w-[380px]">
        <CardHeader>
          <CardTitle>Add Card</CardTitle>
        </CardHeader>
        <CardContent className="rounded-xl bg-card pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="holder"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Holder</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>Card holder name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fingerprint"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          value={field.value}
                          className="cursor-not-allowed"
                        />
                        <CardAddSelectDialog {...field}>
                          <Button>Select card</Button>
                        </CardAddSelectDialog>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Scan card with any device and select it.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 max-sm:flex-col">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  Submit
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={() => form.reset()}
                >
                  Clear
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
