import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.prizes.$post>;
type RequestType = InferRequestType<typeof client.api.prizes.$post>["json"];

export const useCreatePrize = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.prizes.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Prize created");
      queryClient.invalidateQueries({ queryKey: ["prizes"] });
    },
    onError: () => {
      toast.error("Failed to create prize");
    },
  });
  return mutation;
};
