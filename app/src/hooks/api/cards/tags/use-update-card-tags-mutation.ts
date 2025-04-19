import { axiosInstance } from "@/lib/axios";
import {
  type CardTagsUpdate,
  type CardTagsUpdateResponse,
} from "@/lib/validations/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface useUpdateCardTagsMutationProps {
  id: string;
}

export function useUpdateCardTagsMutation({
  id,
}: useUpdateCardTagsMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<CardTagsUpdateResponse>,
    AxiosError,
    CardTagsUpdate
  >({
    mutationKey: ["Cards", "Tags", "Update"],
    mutationFn: (update) => axiosInstance.post(`/cards/${id}/tags`, update),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["Cards", "Tags", "GetAll", id],
      }),
  });
}
