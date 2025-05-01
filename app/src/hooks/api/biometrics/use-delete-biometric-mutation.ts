import { axiosInstance } from "@/lib/axios";
import type { BiometricResponse } from "@/lib/validations/biometric";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface useDeleteBiometricMutationProps {
  id: string;
}

export function useDeleteBiometricMutation({
  id,
}: useDeleteBiometricMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<BiometricResponse>, AxiosError>({
    mutationKey: ["Biometrics", "Delete"],
    mutationFn: () => axiosInstance.delete(`/biometrics/${id}`),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["Biometrics", "GetAll"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["Biometrics", "Get", id],
        }),
      ]),
  });
}
