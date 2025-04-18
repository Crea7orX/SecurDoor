import { axiosInstance } from "@/lib/axios";
import type { ApiKeyCreate, ApiKeyResponse } from "@/lib/validations/api-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

export function useCreateApiKeyMutation() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ApiKeyResponse>, AxiosError, ApiKeyCreate>({
    mutationKey: ["ApiKeys", "Create"],
    mutationFn: (create) => axiosInstance.post("/api_keys", create),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["ApiKeys", "GetAll"],
      }),
  });
}
