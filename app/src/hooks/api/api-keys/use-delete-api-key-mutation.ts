import { axiosInstance } from "@/lib/axios";
import { type ApiKeyResponse } from "@/lib/validations/api-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface useDeleteApiKeyMutationProps {
  id: string;
}

export function useDeleteApiKeyMutation({ id }: useDeleteApiKeyMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ApiKeyResponse>, AxiosError>({
    mutationKey: ["ApiKeys", "Delete"],
    mutationFn: () => axiosInstance.delete(`/api_keys/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["ApiKeys", "GetAll"],
      }),
  });
}
