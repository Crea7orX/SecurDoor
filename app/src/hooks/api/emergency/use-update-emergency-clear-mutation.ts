import { axiosInstance } from "@/lib/axios";
import { type EmergencyResponse } from "@/lib/validations/emergency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface UseUpdateEmergencyClearMutationProps {
  id: string;
}

export function useUpdateEmergencyClearMutation({
  id,
}: UseUpdateEmergencyClearMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<EmergencyResponse>, AxiosError>({
    mutationKey: ["Emergency", "Update", "Clear"],
    mutationFn: () => axiosInstance.post(`/emergency/${id}/clear`),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["Emergency", "Get", id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["Devices", "Get", id],
        }),
      ]),
  });
}
