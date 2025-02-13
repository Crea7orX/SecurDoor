import { axiosInstance } from "@/lib/axios";
import { type DeviceResponse } from "@/lib/validations/device";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface UseGetDeviceByIdQueryProps
  extends Partial<UseQueryOptions<DeviceResponse, AxiosError>> {
  id: string;
}

export function useGetDeviceByIdQuery({
  id,
  ...options
}: UseGetDeviceByIdQueryProps) {
  return useQuery<DeviceResponse, AxiosError>({
    ...options,
    queryKey: ["Devices", "Get", id],
    queryFn: async () =>
      (await axiosInstance.get(`/devices/${id}`)).data as DeviceResponse,
  });
}
