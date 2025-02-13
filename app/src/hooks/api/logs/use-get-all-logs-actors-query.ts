import { axiosInstance } from "@/lib/axios";
import { type LogActorResponse } from "@/lib/validations/log";
import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";

export function useGetAllLogsActorsQuery() {
  return useQuery<LogActorResponse[], AxiosError>({
    queryKey: ["Logs", "Actors", "GetAll"],
    queryFn: async () =>
      (await axiosInstance.get("/logs/actors")).data as LogActorResponse[],
  });
}
