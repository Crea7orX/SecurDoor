"use client";

import CardsLoading from "@/app/dashboard/cards/loading";
import { CardCard } from "@/components/cards/card-card";
import { Button } from "@/components/ui/button";
import { useGetAllCardsQuery } from "@/hooks/api/cards/use-get-all-cards-query";
import { PlusCircle } from "lucide-react";

export default function CardsPage() {
  const { data, isLoading } = useGetAllCardsQuery();

  if (isLoading) {
    return <CardsLoading />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <Button asChild>
        <a href="/dashboard/cards/add">
          <PlusCircle className="size-4" />
          Add Card
        </a>
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-12">
        {data?.map((card, index) => <CardCard key={index} card={card} />)}
      </div>
    </div>
  );
}
