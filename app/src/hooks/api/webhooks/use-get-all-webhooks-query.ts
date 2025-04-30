import { axiosInstance } from "@/lib/axios";
import { type WebhookResponse } from "@/lib/validations/webhook";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { type AxiosError } from "axios";

export function useGetAllWebhooksQuery({
  ...options
}: Partial<UseQueryOptions<WebhookResponse[], AxiosError>>) {
  return useQuery<WebhookResponse[], AxiosError>({
    ...options,
    queryKey: ["Webhooks", "GetAll"],
    queryFn: async () =>
      (await axiosInstance.get("/webhooks")).data as WebhookResponse[],
  });
}
