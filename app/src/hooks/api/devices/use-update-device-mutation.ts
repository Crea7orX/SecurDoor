import { axiosInstance } from "@/lib/axios";
import {
  type DeviceResponse,
  type DeviceUpdate,
} from "@/lib/validations/device";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface UseUpdateDeviceMutationProps {
  id: string;
}

export function useUpdateDeviceMutation({ id }: UseUpdateDeviceMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<DeviceResponse>, AxiosError, DeviceUpdate>({
    mutationKey: ["Devices", "Update"],
    mutationFn: (update) => axiosInstance.put(`/devices/${id}`, update),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["Devices", "GetAll"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["Devices", "Get", id],
        }),
      ]),
  });
}
