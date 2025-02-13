import { axiosInstance } from "@/lib/axios";
import { type CardResponse, type CardUpdate } from "@/lib/validations/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface useUpdateCardMutationProps {
  id: string;
}

export function useUpdateCardMutation({ id }: useUpdateCardMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<CardResponse>, AxiosError, CardUpdate>({
    mutationKey: ["Cards", "Update"],
    mutationFn: (update) => axiosInstance.put(`/cards/${id}`, update),
    onSuccess: (response) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["Cards", "GetAll"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["Cards", "Get", id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["Cards", "Get", "Fingerprint", response.data.fingerprint],
        }),
      ]),
  });
}
