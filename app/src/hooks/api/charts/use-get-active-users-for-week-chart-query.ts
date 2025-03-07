import { axiosInstance } from "@/lib/axios";
import { type ChartActiveUsersForWeekResponse } from "@/lib/validations/chart";
import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface UseGetActiveUsersForWeekChartQueryProps
  extends Partial<
    UseQueryOptions<ChartActiveUsersForWeekResponse[], AxiosError>
  > {
  isDashboard?: boolean;
}

export function useGetActiveUsersForWeekChartQuery({
  isDashboard = false,
  ...options
}: UseGetActiveUsersForWeekChartQueryProps) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return useQuery<ChartActiveUsersForWeekResponse[], AxiosError>({
    ...options,
    queryKey: ["Charts", "Get", "ActiveUsersForWeek", isDashboard],
    queryFn: async () =>
      (
        await axiosInstance.get(
          `/charts/active_users?dashboard=${isDashboard}&userTimezone=${userTimezone}`,
        )
      ).data as ChartActiveUsersForWeekResponse[],
    placeholderData: keepPreviousData,
  });
}
