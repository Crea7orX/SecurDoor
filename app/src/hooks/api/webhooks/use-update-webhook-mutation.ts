import { axiosInstance } from "@/lib/axios";
import {
  type WebhookResponse,
  type WebhookUpdate,
} from "@/lib/validations/webhook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface useUpdateWebhookMutationProps {
  id: string;
}

export function useUpdateWebhookMutation({
  id,
}: useUpdateWebhookMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<WebhookResponse>, AxiosError, WebhookUpdate>(
    {
      mutationKey: ["Webhooks", "Update"],
      mutationFn: (update) => axiosInstance.put(`/webhooks/${id}`, update),
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: ["Webhooks", "GetAll"],
        }),
    },
  );
}
