import { axiosInstance } from "@/lib/axios";
import { type EmergencyCountResponse } from "@/lib/validations/emergency";
import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";

export function useGetEmergencyCountQuery() {
  return useQuery<EmergencyCountResponse, AxiosError>({
    queryKey: ["Emergency", "Get", "Count"],
    queryFn: async () =>
      (await axiosInstance.get("/emergency/count"))
        .data as EmergencyCountResponse,
  });
}
