import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function TagsLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-1 sm:p-4">
      <DataTableSkeleton
        columnCount={3}
        headersCount={[3]}
        searchableColumnCount={1}
        cellWidths={["10rem", "10rem"]}
        headersWidths={[["4rem", "8rem"]]}
        actionWidths={["10.5rem"]}
        showViewOptions={false}
        showSelectColumn={false}
        shrinkZero
      />
    </div>
  );
}
