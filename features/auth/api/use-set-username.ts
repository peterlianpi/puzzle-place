import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/api/hono-client";

type ResponseType = InferResponseType<
  (typeof client.api)["auth-user"]["set-username"]["$post"]
>;

export const useSetUsername = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (json: { username: string }) => {
      const response = await client.api["auth-user"]["set-username"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Username set successfully!");
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["get-user"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to set username. Please try again.");
    },
  });

  return mutation;
};
