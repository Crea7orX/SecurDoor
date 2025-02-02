import { axiosInstance } from "@/lib/axios";
import {
  type AccessDeviceUpdate,
  type AccessDeviceUpdateResponse,
} from "@/lib/validations/access";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface UseUpdateAccessDeviceMutationProps {
  id: string;
}

export function useUpdateAccessDeviceMutation({
  id,
}: UseUpdateAccessDeviceMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<AccessDeviceUpdateResponse>,
    AxiosError,
    AccessDeviceUpdate
  >({
    mutationKey: ["Access", "Devices", "Update"],
    mutationFn: (update) => axiosInstance.post(`/access/devices/${id}`, update),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["Access", "Devices", "GetAll", id],
      }),
  });
}
