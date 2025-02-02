import { axiosInstance } from "@/lib/axios";
import { type AccessCardResponse } from "@/lib/validations/access";
import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface UseGetAllAccessCardsQueryProps {
  id: string;
}

export function useGetAllAccessCardsQuery({
  id,
}: UseGetAllAccessCardsQueryProps) {
  return useQuery<AccessCardResponse, AxiosError>({
    queryKey: ["Access", "Cards", "GetAll", id],
    queryFn: async () => (await axiosInstance.get(`/access/cards/${id}`)).data,
  });
}
