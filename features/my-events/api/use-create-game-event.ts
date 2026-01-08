import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api)["my-events"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api)["my-events"]["$post"]
>["json"];

export const useCreateGameEvent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api["my-events"]["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Event created");
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    },
    onError: () => {
      toast.error("Failed to create event");
    },
  });
  return mutation;
};
