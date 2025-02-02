import { axiosInstance } from "@/lib/axios";
import {
  type AccessCardUpdate,
  type AccessCardUpdateResponse,
} from "@/lib/validations/access";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";

interface UseUpdateAccessCardMutationProps {
  id: string;
}

export function useUpdateAccessCardMutation({
  id,
}: UseUpdateAccessCardMutationProps) {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<AccessCardUpdateResponse>,
    AxiosError,
    AccessCardUpdate
  >({
    mutationKey: ["Access", "Cards", "Update"],
    mutationFn: (update) => axiosInstance.post(`/access/cards/${id}`, update),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["Access", "Cards", "GetAll", id],
      }),
  });
}
