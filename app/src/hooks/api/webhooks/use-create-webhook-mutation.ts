import { axiosInstance } from "@/lib/axios";
import {
  type WebhookCreate,
  type WebhookResponse,
} from "@/lib/validations/webhook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

export function useCreateWebhookMutation() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<WebhookResponse>, AxiosError, WebhookCreate>(
    {
      mutationKey: ["Webhooks", "Create"],
      mutationFn: (create) => axiosInstance.post("/webhooks", create),
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: ["Webhooks", "GetAll"],
        }),
    },
  );
}
