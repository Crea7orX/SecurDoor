import { useParseSearchParams } from "@/hooks/use-parse-search-params";
import { axiosInstance } from "@/lib/axios";
import { LogsPaginatedResponse } from "@/lib/validations/log";
import { SearchParams } from "@/types/data-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UseGetAllLogsQueryProps {
  searchParams: SearchParams;
}

export function useGetAllLogsQuery({ searchParams }: UseGetAllLogsQueryProps) {
  const search = useParseSearchParams(searchParams);

  return useQuery<LogsPaginatedResponse, AxiosError>({
    queryKey: ["Logs", "GetAll", searchParams],
    queryFn: async () => (await axiosInstance.get(`/logs?${search}`)).data,
    placeholderData: keepPreviousData,
  });
}
