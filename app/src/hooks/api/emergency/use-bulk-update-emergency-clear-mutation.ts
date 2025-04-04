import { axiosInstance } from "@/lib/axios";
import { type DeviceBulk } from "@/lib/validations/device";
import { type EmergencyResponse } from "@/lib/validations/emergency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

export function useBulkEmergencyClearMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<EmergencyResponse[]>,
    AxiosError,
    DeviceBulk
  >({
    mutationKey: ["Emergency", "Update", "Clear"],
    mutationFn: (update) => axiosInstance.post("/emergency/bulk/clear", update),
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
      ]),
  });
}
