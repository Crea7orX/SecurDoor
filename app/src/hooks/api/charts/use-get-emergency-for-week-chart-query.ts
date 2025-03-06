import { axiosInstance } from "@/lib/axios";
import { type ChartEmergencyForWeekResponse } from "@/lib/validations/chart";
import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { type AxiosError } from "axios";

export function useGetEmergencyForWeekChartQuery({
  ...options
}: Partial<UseQueryOptions<ChartEmergencyForWeekResponse[], AxiosError>>) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return useQuery<ChartEmergencyForWeekResponse[], AxiosError>({
    ...options,
    queryKey: ["Charts", "Get", "EmergencyForWeek"],
    queryFn: async () =>
      (
        await axiosInstance.get(
          `/charts/emergency?userTimezone=${userTimezone}`,
        )
      ).data as ChartEmergencyForWeekResponse[],
    placeholderData: keepPreviousData,
  });
}
