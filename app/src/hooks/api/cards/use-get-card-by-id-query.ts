import { axiosInstance } from "@/lib/axios";
import { type CardResponse } from "@/lib/validations/card";
import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface useGetCardByIdQueryProps {
  id: string;
}

export function useGetCardByIdQuery({ id }: useGetCardByIdQueryProps) {
  return useQuery<CardResponse, AxiosError>({
    queryKey: ["Cards", "Get", id],
    queryFn: async () =>
      (await axiosInstance.get(`/cards/${id}`)).data as CardResponse,
  });
}
