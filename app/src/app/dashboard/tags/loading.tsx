import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function TagsLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-1 sm:p-4">
      <DataTableSkeleton
        columnCount={4}
        headersCount={[4]}
        searchableColumnCount={1}
        cellWidths={["14rem", "4rem", "10rem"]}
        headersWidths={[["4rem", "8rem", "8rem"]]}
        actionWidths={["10.5rem"]}
        showViewOptions={false}
        showSelectColumn={false}
        shrinkZero
      />
    </div>
  );
}
