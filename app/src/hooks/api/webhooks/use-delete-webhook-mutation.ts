import { axiosInstance } from "@/lib/axios";
import { type WebhookResponse } from "@/lib/validations/webhook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface useDeleteWebhookMutationProps {
  id: string;
}

export function useDeleteWebhookMutation({
  id,
}: useDeleteWebhookMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<WebhookResponse>, AxiosError>({
    mutationKey: ["Webhooks", "Delete"],
    mutationFn: () => axiosInstance.delete(`/webhooks/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["Webhooks", "GetAll"],
      }),
  });
}
