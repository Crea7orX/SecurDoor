import { axiosInstance } from "@/lib/axios";
import { DeviceResponse } from "@/lib/validations/device";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetAllDevicesQuery() {
  return useQuery<DeviceResponse[], AxiosError>({
    queryKey: ["Devices", "GetAll"],
    queryFn: async () => (await axiosInstance.get("/devices")).data,
  });
}
