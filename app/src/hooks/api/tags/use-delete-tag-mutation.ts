import { axiosInstance } from "@/lib/axios";
import { type TagResponse } from "@/lib/validations/tag";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface useDeleteTagMutationProps {
  id: string;
}

export function useDeleteTagMutation({ id }: useDeleteTagMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<TagResponse>, AxiosError>({
    mutationKey: ["Tags", "Delete"],
    mutationFn: () => axiosInstance.delete(`/tags/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["Tags", "GetAll"],
      }),
  });
}
