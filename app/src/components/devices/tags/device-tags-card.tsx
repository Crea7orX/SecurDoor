"use client";

import { DeviceTagsEditDialog } from "@/components/devices/tags/device-tags-edit-dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllDeviceTagsQuery } from "@/hooks/api/devices/tags/use-get-all-device-tags-query";
import { PinOff, SlidersHorizontal, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface DeviceTagsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const DeviceTagsCard = React.forwardRef<HTMLDivElement, DeviceTagsCardProps>(
  ({ className, id, ...props }, ref) => {
    const t = useTranslations("Device.tags");

    const { data, isLoading } = useGetAllDeviceTagsQuery({ id });

    return (
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <Tag className="size-6" />
            <span>{t("title")}</span>
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea>
            <div className="flex max-h-24 flex-wrap gap-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </>
              ) : (
                <>
                  {!data?.tags.length && (
                    <Badge variant="default" className="text-md">
                      <PinOff className="mr-1 size-4" />
                      {t("none")}
                    </Badge>
                  )}
                  {data?.tags?.map((tag) => (
                    <Badge key={tag.id} variant="info" className="text-md">
                      {tag.name}
                    </Badge>
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
          <Separator className="mt-6 h-1 rounded-xl" />
        </CardContent>
        <CardFooter className="justify-end gap-2 max-md:flex-col">
          <DeviceTagsEditDialog id={id} tags={data?.tags ?? []}>
            <Button
              variant="info"
              className="max-md:w-full"
              disabled={isLoading}
            >
              <SlidersHorizontal />
              <span>{t("edit_button")}</span>
            </Button>
          </DeviceTagsEditDialog>
        </CardFooter>
      </Card>
    );
  },
);
DeviceTagsCard.displayName = "DeviceAccessCard";

export { DeviceTagsCard };
