import { axiosInstance } from "@/lib/axios";
import { type AccessDeviceResponse } from "@/lib/validations/access";
import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface UseGetAllAccessDevicesQueryProps {
  id: string;
}

export function useGetAllAccessDevicesQuery({
  id,
}: UseGetAllAccessDevicesQueryProps) {
  return useQuery<AccessDeviceResponse, AxiosError>({
    queryKey: ["Access", "Devices", "GetAll", id],
    queryFn: async () =>
      (await axiosInstance.get(`/access/devices/${id}`)).data,
  });
}
