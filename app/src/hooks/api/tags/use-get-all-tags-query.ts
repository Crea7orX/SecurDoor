import { useParseSearchParams } from "@/hooks/use-parse-search-params";
import { axiosInstance } from "@/lib/axios";
import { type TagsPaginatedResponse } from "@/lib/validations/tag";
import { type SearchParams } from "@/types/data-table";
import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface useGetAllTagsQueryProps
  extends Partial<UseQueryOptions<TagsPaginatedResponse, AxiosError>> {
  searchParams: SearchParams;
}

export function useGetAllTagsQuery({
  searchParams,
  ...options
}: useGetAllTagsQueryProps) {
  const search = useParseSearchParams(searchParams);

  return useQuery<TagsPaginatedResponse, AxiosError>({
    ...options,
    queryKey: ["Tags", "GetAll", searchParams],
    queryFn: async () =>
      (await axiosInstance.get(`/tags?${search}`))
        .data as TagsPaginatedResponse,
    placeholderData: keepPreviousData,
  });
}
