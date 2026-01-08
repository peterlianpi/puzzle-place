import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api)["my-events"][":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api)["my-events"][":id"]["$patch"]
>["json"];

export const useUpdateGameEvent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType & { id: string }
  >({
    mutationFn: async (data) => {
      const { id, ...json } = data;
      const response = await client.api["my-events"][":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Event updated");
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    },
    onError: () => {
      toast.error("Failed to update event");
    },
  });
  return mutation;
};
