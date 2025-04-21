"use client";

import { Button } from "@/components/ui/button";
import { useDataTableViewStore } from "@/hooks/store/use-data-table-view-store";
import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";
import * as React from "react";

export function DataTableViewButtons({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const { view, setView } = useDataTableViewStore();

  return (
    <div className="whitespace-nowrap rounded-md border bg-muted">
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-[1.875rem] rounded-r-none border-0 bg-accent shadow-none hover:bg-background/30",
          view === "grid" && "!bg-background",
          className,
        )}
        onClick={(e) => {
          props.onClick?.(e);
          if (view === "grid") return;
          setView("grid");
        }}
        {...props}
      >
        <LayoutGrid />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-[1.875rem] rounded-l-none border-0 border-l bg-accent shadow-none hover:bg-background/30",
          view === "list" && "!bg-background",
          className,
        )}
        onClick={(e) => {
          props.onClick?.(e);
          if (view === "list") return;
          setView("list");
        }}
        {...props}
      >
        <List />
      </Button>
    </div>
  );
}
