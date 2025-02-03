import { axiosInstance } from "@/lib/axios";
import { type DeviceResponse } from "@/lib/validations/device";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface UseDeleteDeviceMutationProps {
  id: string;
}

export function useDeleteDeviceMutation({ id }: UseDeleteDeviceMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<DeviceResponse>, AxiosError>({
    mutationKey: ["Devices", "Delete"],
    mutationFn: () => axiosInstance.delete(`/devices/${id}`),
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
