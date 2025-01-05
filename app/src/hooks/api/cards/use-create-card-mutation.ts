import { axiosInstance } from "@/lib/axios";
import { CardCreate, CardResponse } from "@/lib/validations/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export function useCreateCardMutation() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<CardResponse>, AxiosError, CardCreate>({
    mutationKey: ["Cards", "Create"],
    mutationFn: (create) => axiosInstance.post("/cards", create),
    onSuccess: (_, create) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["Cards", "GetAll"],
        }),
        queryClient.invalidateQueries({
          // Invalidate if card with same fingerprint is removed and then added again
          queryKey: ["Cards", "Get", "Fingerprint", create.fingerprint],
        }),
      ]),
  });
}
