import { CardCardSkeleton } from "@/components/cards/card-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
import * as React from "react";

export default function CardsLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <div className="flex w-full items-center justify-between gap-2 overflow-auto p-1">
        <div className="flex flex-1 items-center gap-2">
          <Skeleton className="h-8 w-40 lg:w-64" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Button size="sm" asChild>
          <a href="/dashboard/cards/add">
            <PlusCircle className="size-4" />
            Add Card
          </a>
        </Button>
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-12 rounded-lg border bg-muted/60 px-2 py-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <CardCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
