import { axiosInstance } from "@/lib/axios";
import { type TagResponse, type TagUpdate } from "@/lib/validations/tag";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface useUpdateTagMutationProps {
  id: string;
}

export function useUpdateTagMutation({ id }: useUpdateTagMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<TagResponse>, AxiosError, TagUpdate>({
    mutationKey: ["Tags", "Update"],
    mutationFn: (update) => axiosInstance.put(`/tags/${id}`, update),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["Tags", "GetAll"],
      }),
  });
}
