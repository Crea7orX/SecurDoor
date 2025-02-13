import { axiosInstance } from "@/lib/axios";
import {
  type DeviceCreate,
  type DeviceResponse,
} from "@/lib/validations/device";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

export function useCreateDeviceMutation() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<DeviceResponse>, AxiosError, DeviceCreate>({
    mutationKey: ["Devices", "Create"],
    mutationFn: (newDevice) => axiosInstance.post("/devices", newDevice),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["Devices", "GetAll"],
      }),
  });
}
