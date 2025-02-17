"use client";

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
import { useCreateDeviceMutation } from "@/hooks/api/devices/use-create-device-mutation";
import { type DeviceWithSameSerialIdError } from "@/lib/exceptions";
import {
  type DeviceCreate,
  deviceCreateSchema,
} from "@/lib/validations/device";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function DevicesAddPage() {
  const router = useRouter();

  const { mutateAsync: add } = useCreateDeviceMutation();

  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<DeviceCreate>({
    resolver: zodResolver(deviceCreateSchema),
    defaultValues: {
      name: "",
      serialId: "",
    },
  });

  function onSubmit(data: DeviceCreate) {
    setIsLoading(true);
    const toastId = toast.loading("Adding Device...");

    add(data)
      .then((data) => {
        toast.success("Device Added!", {
          id: toastId,
        });

        router.push(`/dashboard/devices/${data.data.id}`);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 409) {
            const responseData = error.response
              .data as DeviceWithSameSerialIdError;

            toast.error("Device with this Serial ID already exists!", {
              id: toastId,
              ...(responseData.id && {
                action: (
                  <Button asChild>
                    <Link href={`/dashboard/devices/${responseData.id}`}>
                      View device
                    </Link>
                  </Button>
                ),
              }),
            });
            return;
          }
        }

        toast.error("Failed to add device!", {
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
        <Link href="/dashboard/devices">
          <ArrowLeft className="size-4" />
          Go Back
        </Link>
      </Button>
      <Card className="bg-border lg:min-w-[380px]">
        <CardHeader>
          <CardTitle>Add Device</CardTitle>
        </CardHeader>
        <CardContent className="rounded-xl bg-card pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Door 1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Display name for the device.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialId"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="abcdefgh-1234-5678-90ab-cdef12345678"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The identifier written on the back of the device.
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
