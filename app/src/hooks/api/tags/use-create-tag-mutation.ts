import { axiosInstance } from "@/lib/axios";
import { type TagCreate, type TagResponse } from "@/lib/validations/tag";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

export function useCreateTagMutation() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<TagResponse>, AxiosError, TagCreate>({
    mutationKey: ["Tags", "Create"],
    mutationFn: (create) => axiosInstance.post("/tags", create),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["Tags", "GetAll"],
      }),
  });
}
