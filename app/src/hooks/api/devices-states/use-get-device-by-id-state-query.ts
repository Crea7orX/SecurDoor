import { axiosInstance } from "@/lib/axios";
import { type DeviceStateResponse } from "@/lib/validations/device-state";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface UseGetDeviceByIdStateQueryProps
  extends Partial<UseQueryOptions<DeviceStateResponse, AxiosError>> {
  id: string;
}

export function useGetDeviceByIdStateQuery({
  id,
  ...options
}: UseGetDeviceByIdStateQueryProps) {
  return useQuery<DeviceStateResponse, AxiosError>({
    ...options,
    queryKey: ["DevicesState", "Get", id],
    queryFn: async () => (await axiosInstance.get(`/devices/${id}/state`)).data,
  });
}
