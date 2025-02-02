import { useParseSearchParams } from "@/hooks/use-parse-search-params";
import { axiosInstance } from "@/lib/axios";
import { type CardsPaginatedResponse } from "@/lib/validations/card";
import { type SearchParams } from "@/types/data-table";
import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface UseGetAllCardsQueryProps
  extends Partial<UseQueryOptions<CardsPaginatedResponse, AxiosError>> {
  searchParams: SearchParams;
}

export function useGetAllCardsQuery({
  searchParams,
  ...options
}: UseGetAllCardsQueryProps) {
  const search = useParseSearchParams(searchParams);

  return useQuery<CardsPaginatedResponse, AxiosError>({
    ...options,
    queryKey: ["Cards", "GetAll", searchParams],
    queryFn: async () => (await axiosInstance.get(`/cards?${search}`)).data,
    placeholderData: keepPreviousData,
  });
}
