import { axiosInstance } from "@/lib/axios";
import {
  type EmergencyResponse,
  type EmergencyUpdate,
} from "@/lib/validations/emergency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface UseUpdateEmergencyMutationProps {
  id: string;
}

export function useUpdateEmergencyMutation({
  id,
}: UseUpdateEmergencyMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<EmergencyResponse>,
    AxiosError,
    EmergencyUpdate
  >({
    mutationKey: ["Emergency", "Update"],
    mutationFn: (update) => axiosInstance.post(`/emergency/${id}`, update),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["Emergency", "Get", id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["Devices", "Get", id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["Emergency", "Get", "Count"],
        }),
      ]),
  });
}
