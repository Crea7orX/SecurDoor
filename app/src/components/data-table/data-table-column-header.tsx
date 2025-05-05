import { cn } from "@/lib/utils";
import { type Column } from "@tanstack/react-table";
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<"div"> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  className,
  column,
  title,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        className,
        "inline-flex items-center text-secondary-foreground",
        column.getCanSort() && "cursor-pointer",
      )}
      onClick={() => {
        if (!column.getCanSort()) return;
        column.toggleSorting(column.getIsSorted() === "asc");
      }}
      {...props}
    >
      {t(title)}
      {column.getCanSort() && (
        <ChevronUp
          className={cn(
            "ml-2 size-4 transition-all",
            !column.getIsSorted() && "opacity-0",
            column.getIsSorted() === "desc" && "-rotate-180",
          )}
        />
      )}
    </div>
  );
}
