"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetDeviceByIdQuery } from "@/hooks/api/devices/use-get-device-by-id-query";
import type { BiometricResponse } from "@/lib/validations/biometric";
import { DoorOpen, Eye, IdCard } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";
import { Skeleton } from "../ui/skeleton";

interface BiometricAccessCardProps extends React.ComponentProps<typeof Card> {
  biometric: BiometricResponse;
}

export function BiometricAccessCard({
  className,
  biometric,
  ...props
}: BiometricAccessCardProps) {
  const t = useTranslations("Biometric.access");

  const { data, isLoading } = useGetDeviceByIdQuery({ id: biometric.deviceId });

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1">
          <IdCard className="size-6" />
          <span>{t("title")}</span>
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <Badge variant="info" className="text-md">
            <DoorOpen className="mr-1 size-4" />
            <span>{data?.name}</span>
          </Badge>
        )}
        <Separator className="mt-6 h-1 rounded-xl" />
      </CardContent>
      <CardFooter className="justify-end gap-2 max-md:flex-col">
        <Button variant="info" className="max-md:w-full" asChild>
          <Link href={`/dashboard/devices/${biometric.deviceId}`}>
            <Eye />
            <span>{t("view_device")}</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
