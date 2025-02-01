import { useParseSearchParams } from "@/hooks/use-parse-search-params";
import { axiosInstance } from "@/lib/axios";
import { type CardsPaginatedResponse } from "@/lib/validations/card";
import { type SearchParams } from "@/types/data-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface UseGetAllCardsQueryProps {
  searchParams: SearchParams;
}

export function useGetAllCardsQuery({
  searchParams,
}: UseGetAllCardsQueryProps) {
  const search = useParseSearchParams(searchParams);

  return useQuery<CardsPaginatedResponse, AxiosError>({
    queryKey: ["Cards", "GetAll", searchParams],
    queryFn: async () => (await axiosInstance.get(`/cards?${search}`)).data,
    placeholderData: keepPreviousData,
  });
}
