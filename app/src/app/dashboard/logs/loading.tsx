import { LogCardSkeleton } from "@/components/logs/log-card";

export default function LogsLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <div className="flex w-full flex-col justify-center gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <LogCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
