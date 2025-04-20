import { axiosInstance } from "@/lib/axios";
import {
  type DeviceTagsUpdate,
  type DeviceTagsUpdateResponse,
} from "@/lib/validations/device";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface useUpdateDeviceTagsMutationProps {
  id: string;
}

export function useUpdateDeviceTagsMutation({
  id,
}: useUpdateDeviceTagsMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<DeviceTagsUpdateResponse>,
    AxiosError,
    DeviceTagsUpdate
  >({
    mutationKey: ["Devices", "Tags", "Update"],
    mutationFn: (update) => axiosInstance.post(`/devices/${id}/tags`, update),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["Devices", "Tags", "GetAll", id],
      }),
  });
}
