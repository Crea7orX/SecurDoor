import { axiosInstance } from "@/lib/axios";
import { LogResponse } from "@/lib/validations/log";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetAllLogsQuery() {
  return useQuery<LogResponse[], AxiosError>({
    queryKey: ["Logs", "GetAll"],
    queryFn: async () => (await axiosInstance.get("/logs")).data,
  });
}
