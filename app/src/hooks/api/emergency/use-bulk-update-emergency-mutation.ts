import { axiosInstance } from "@/lib/axios";
import {
  type EmergencyBulkUpdate,
  type EmergencyResponse,
} from "@/lib/validations/emergency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

export function useBulkUpdateEmergencyMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<EmergencyResponse[]>,
    AxiosError,
    EmergencyBulkUpdate
  >({
    mutationKey: ["Emergency", "Update"],
    mutationFn: (update) => axiosInstance.post("/emergency/bulk", update),
    onSuccess: (_, update) =>
      Promise.all([
        ...update.deviceIds.flatMap((id) => [
          queryClient.invalidateQueries({
            queryKey: ["Emergency", "Get", id],
          }),
          queryClient.invalidateQueries({
            queryKey: ["Devices", "Get", id],
          }),
        ]),
        queryClient.invalidateQueries({
          queryKey: ["Emergency", "Get", "Count"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["Devices", "GetAll"],
        }),
      ]),
  });
}
