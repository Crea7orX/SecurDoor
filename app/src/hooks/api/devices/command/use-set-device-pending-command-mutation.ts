import { axiosInstance } from "@/lib/axios";
import {
  type DeviceResponse,
  type DeviceSetPendingCommand,
} from "@/lib/validations/device";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface useSetDevicePendingCommandMutationProps {
  id: string;
}

export function useSetDevicePendingCommandMutation({
  id,
}: useSetDevicePendingCommandMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<DeviceResponse>,
    AxiosError,
    DeviceSetPendingCommand
  >({
    mutationKey: ["Devices", "Command"],
    mutationFn: (update) =>
      axiosInstance.post(`/devices/${id}/command`, update),
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
