import { axiosInstance } from "@/lib/axios";
import { type ApiKeyResponse } from "@/lib/validations/api-key";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { type AxiosError } from "axios";

export function useGetAllApiKeysQuery({
  ...options
}: Partial<UseQueryOptions<ApiKeyResponse[], AxiosError>>) {
  return useQuery<ApiKeyResponse[], AxiosError>({
    ...options,
    queryKey: ["ApiKeys", "GetAll"],
    queryFn: async () =>
      (await axiosInstance.get("/api_keys")).data as ApiKeyResponse[],
  });
}
