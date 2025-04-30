import { axiosInstance } from "@/lib/axios";
import { type WebhookResponse } from "@/lib/validations/webhook";
import { useMutation } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface useTestWebhookMutationProps {
  id: string;
}

export function useTestWebhookMutation({ id }: useTestWebhookMutationProps) {
  return useMutation<AxiosResponse<WebhookResponse>, AxiosError>({
    mutationKey: ["Webhooks", "Test"],
    mutationFn: () => axiosInstance.post(`/webhooks/${id}/test`),
  });
}
