import { axiosInstance } from "@/lib/axios";
import { type CardResponse } from "@/lib/validations/card";
import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface useGetCardByFingerprintQueryProps {
  fingerprint: string;
}

export function useGetCardByFingerprintQuery({
  fingerprint,
}: useGetCardByFingerprintQueryProps) {
  return useQuery<CardResponse, AxiosError>({
    queryKey: ["Cards", "Get", "Fingerprint", fingerprint],
    queryFn: async () =>
      (await axiosInstance.get(`/cards/${fingerprint}?get_fingerprint=true`))
        .data as CardResponse,
  });
}
