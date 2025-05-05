import { useParseSearchParams } from "@/hooks/use-parse-search-params";
import { axiosInstance } from "@/lib/axios";
import type { BiometricsPaginatedResponse } from "@/lib/validations/biometric";
import { type SearchParams } from "@/types/data-table";
import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface useGetAllBiometricsQueryProps
  extends Partial<UseQueryOptions<BiometricsPaginatedResponse, AxiosError>> {
  searchParams: SearchParams;
}

export function useGetAllBiometricsQuery({
  searchParams,
  ...options
}: useGetAllBiometricsQueryProps) {
  const search = useParseSearchParams(searchParams);

  return useQuery<BiometricsPaginatedResponse, AxiosError>({
    ...options,
    queryKey: ["Biometrics", "GetAll", searchParams],
    queryFn: async () =>
      (await axiosInstance.get(`/biometrics?${search}`))
        .data as BiometricsPaginatedResponse,
    placeholderData: keepPreviousData,
  });
}
