import { axiosInstance } from "@/lib/axios";
import { type CardTagsResponse } from "@/lib/validations/card";
import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface useGetAllCardTagsQueryProps {
  id: string;
}

export function useGetAllCardTagsQuery({ id }: useGetAllCardTagsQueryProps) {
  return useQuery<CardTagsResponse, AxiosError>({
    queryKey: ["Cards", "Tags", "GetAll", id],
    queryFn: async () =>
      (await axiosInstance.get(`/cards/${id}/tags`)).data as CardTagsResponse,
  });
}
