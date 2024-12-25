import { axiosInstance } from "@/lib/axios";
import { DeviceResponse } from "@/lib/validations/device";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UseGetDeviceByIdQueryProps {
  id: string;
}

export function useGetDeviceByIdQuery({ id }: UseGetDeviceByIdQueryProps) {
  return useQuery<DeviceResponse, AxiosError>({
    queryKey: ["Devices", "Get", id],
    queryFn: async () => (await axiosInstance.get(`/devices/${id}`)).data,
  });
}
