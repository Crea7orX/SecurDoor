import { axiosInstance } from "@/lib/axios";
import { type CardResponse } from "@/lib/validations/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface useDeleteCardMutationProps {
  id: string;
}

export function useDeleteCardMutation({ id }: useDeleteCardMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<CardResponse>, AxiosError>({
    mutationKey: ["Cards", "Delete"],
    mutationFn: () => axiosInstance.delete(`/cards/${id}`),
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
