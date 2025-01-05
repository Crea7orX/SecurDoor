import { axiosInstance } from "@/lib/axios";
import { CardResponse } from "@/lib/validations/card";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetAllCardsQuery() {
  return useQuery<CardResponse[], AxiosError>({
    queryKey: ["Cards", "GetAll"],
    queryFn: async () => (await axiosInstance.get("/cards")).data,
  });
}
