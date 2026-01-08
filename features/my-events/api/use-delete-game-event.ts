import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api)["my-events"][":id"]["$delete"]
>;
type RequestType = InferRequestType<
  (typeof client.api)["my-events"][":id"]["$delete"]
>;

export const useDeleteGameEvent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType["param"]>({
    mutationFn: async (param) => {
      const response = await client.api["my-events"][":id"]["$delete"]({
        param,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Event deleted");
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    },
    onError: (error) => {
      toast.error("Failed to delete event");
      console.error("Delete error:", error);
    },
  });

  return mutation;
};
