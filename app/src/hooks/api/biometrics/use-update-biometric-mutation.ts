import { axiosInstance } from "@/lib/axios";
import type {
  BiometricResponse,
  BiometricUpdate,
} from "@/lib/validations/biometric";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface useUpdateBiometricMutationProps {
  id: string;
}

export function useUpdateBiometricMutation({
  id,
}: useUpdateBiometricMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<BiometricResponse>,
    AxiosError,
    BiometricUpdate
  >({
    mutationKey: ["Biometrics", "Update"],
    mutationFn: (update) => axiosInstance.put(`/biometrics/${id}`, update),
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
