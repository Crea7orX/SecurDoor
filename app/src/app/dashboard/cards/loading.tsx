import { CardCardSkeleton } from "@/components/cards/card-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import * as React from "react";

export default function CardsLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <Button asChild>
        <a href="/dashboard/cards/add">
          <PlusCircle className="size-4" />
          Add Card
        </a>
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-12">
        {Array.from({ length: 10 }).map((_, index) => (
          <CardCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
