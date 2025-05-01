import { axiosInstance } from "@/lib/axios";
import type { BiometricResponse } from "@/lib/validations/biometric";
import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";

interface useGetBiometricByIdQueryProps {
  id: string;
}

export function useGetBiometricByIdQuery({
  id,
}: useGetBiometricByIdQueryProps) {
  return useQuery<BiometricResponse, AxiosError>({
    queryKey: ["Biometrics", "Get", id],
    queryFn: async () =>
      (await axiosInstance.get(`/biometrics/${id}`)).data as BiometricResponse,
  });
}
