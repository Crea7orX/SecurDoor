"use client";

import { getColumns } from "@/app/dashboard/tags/_components/tags-table-columns";
import TagsLoading from "@/app/dashboard/tags/loading";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DemoAlert } from "@/components/demo/demo-alert";
import { TagCreateDialog } from "@/components/tags/tag-create-dialog";
import { Button } from "@/components/ui/button";
import { useGetAllTagsQuery } from "@/hooks/api/tags/use-get-all-tags-query";
import { useDataTable } from "@/hooks/use-data-table";
import { cn } from "@/lib/utils";
import { type TagResponse } from "@/lib/validations/tag";
import {
  type DataTableFilterField,
  type SearchParams,
} from "@/types/data-table";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface TagsPageProps {
  searchParams: SearchParams;
}

export default function TagsPage({ searchParams }: TagsPageProps) {
  const t = useTranslations("Tag");

  const { data, isLoading, isPlaceholderData } = useGetAllTagsQuery({
    searchParams,
  });

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<TagResponse>[] = [
    {
      id: "name",
      label: t("filter.name.label"),
      placeholder: t("filter.name.placeholder"),
    },
  ];

  const { table } = useDataTable({
    data: data?.data ?? [],
    columns,
    pageCount: data?.pageCount ?? 0,
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  if (isLoading) {
    return <TagsLoading />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-1 sm:p-4">
      <DemoAlert />

      <DataTableToolbar table={table} filterFields={filterFields}>
        <TagCreateDialog>
          <Button size="sm">
            <PlusCircle />
            {t("add.title")}
          </Button>
        </TagCreateDialog>
      </DataTableToolbar>
      <DataTable
        className={cn(isPlaceholderData && "opacity-80")}
        table={table}
        columns={columns}
      />
      <DataTablePagination table={table} enableSelection={false} />
    </div>
  );
}
