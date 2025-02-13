import { useParseSearchParams } from "@/hooks/use-parse-search-params";
import { axiosInstance } from "@/lib/axios";
import { type LogsPaginatedResponse } from "@/lib/validations/log";
import { type SearchParams } from "@/types/data-table";
import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface UseGetAllLogsQueryProps
  extends Partial<UseQueryOptions<LogsPaginatedResponse, AxiosError>> {
  searchParams: SearchParams;
}

export function useGetAllLogsQuery({
  searchParams,
  ...options
}: UseGetAllLogsQueryProps) {
  const search = useParseSearchParams(searchParams);

  return useQuery<LogsPaginatedResponse, AxiosError>({
    ...options,
    queryKey: ["Logs", "GetAll", searchParams],
    queryFn: async () =>
      (await axiosInstance.get(`/logs?${search}`))
        .data as LogsPaginatedResponse,
    placeholderData: keepPreviousData,
  });
}
