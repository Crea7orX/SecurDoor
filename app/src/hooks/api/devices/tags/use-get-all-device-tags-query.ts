import { axiosInstance } from "@/lib/axios";
import { type DeviceTagsResponse } from "@/lib/validations/device";
import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface useGetAllDeviceTagsQueryProps {
  id: string;
}

export function useGetAllDeviceTagsQuery({
  id,
}: useGetAllDeviceTagsQueryProps) {
  return useQuery<DeviceTagsResponse, AxiosError>({
    queryKey: ["Devices", "Tags", "GetAll", id],
    queryFn: async () =>
      (await axiosInstance.get(`/devices/${id}/tags`))
        .data as DeviceTagsResponse,
  });
}
