import { axiosInstance } from "@/lib/axios";
import { type DeviceResponse } from "@/lib/validations/device";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface UseAccessStateUnlockMutationProps {
  id: string;
}

export function useAccessStateUnlockMutation({
  id,
}: UseAccessStateUnlockMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<DeviceResponse>, AxiosError>({
    mutationKey: ["Access", "State", "Unlock"],
    mutationFn: () => axiosInstance.post(`/access/${id}/state/unlock`),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["Devices", "GetAll"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["Devices", "Get", id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["Devices", "State", "Get", id],
        }),
      ]),
  });
}
