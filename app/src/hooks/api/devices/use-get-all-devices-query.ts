import { useParseSearchParams } from "@/hooks/use-parse-search-params";
import { axiosInstance } from "@/lib/axios";
import { type DevicesPaginatedResponse } from "@/lib/validations/device";
import { type SearchParams } from "@/types/data-table";
import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface UseGetAllDevicesQueryProps
  extends Partial<UseQueryOptions<DevicesPaginatedResponse, AxiosError>> {
  searchParams: SearchParams;
}

export function useGetAllDevicesQuery({
  searchParams,
  ...options
}: UseGetAllDevicesQueryProps) {
  const search = useParseSearchParams(searchParams);

  return useQuery<DevicesPaginatedResponse, AxiosError>({
    ...options,
    queryKey: ["Devices", "GetAll", searchParams],
    queryFn: async () => (await axiosInstance.get(`/devices?${search}`)).data,
    placeholderData: keepPreviousData,
  });
}
