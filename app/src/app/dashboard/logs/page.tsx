"use client";

import LogsLoading from "@/app/dashboard/logs/loading";
import { LogCard } from "@/components/logs/log-card";
import { useGetAllLogsQuery } from "@/hooks/api/logs/use-get-all-logs-query";

export default function LogsPage() {
  const { data, isLoading } = useGetAllLogsQuery();

  if (isLoading) {
    return <LogsLoading />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      {/*{todo: add sort and filter buttons}*/}
      <div className="flex w-full flex-col justify-center gap-4">
        {data?.map((log, index) => <LogCard key={index} log={log} />)}
      </div>
    </div>
  );
}
