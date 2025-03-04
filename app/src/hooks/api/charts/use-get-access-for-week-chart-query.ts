import { axiosInstance } from "@/lib/axios";
import { type ChartAccessForWeekResponse } from "@/lib/validations/chart";
import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface UseGetAccessForWeekChartQueryProps
  extends Partial<UseQueryOptions<ChartAccessForWeekResponse[], AxiosError>> {
  isDashboard?: boolean;
}

export function useGetAccessForWeekChartQuery({
  isDashboard = false,
  ...options
}: UseGetAccessForWeekChartQueryProps) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return useQuery<ChartAccessForWeekResponse[], AxiosError>({
    ...options,
    queryKey: ["Charts", "Get", "AccessForWeek", isDashboard],
    queryFn: async () =>
      (
        await axiosInstance.get(
          `/charts/access_for_week?dashboard=${isDashboard}&userTimezone=${userTimezone}`,
        )
      ).data as ChartAccessForWeekResponse[],
    placeholderData: keepPreviousData,
  });
}
