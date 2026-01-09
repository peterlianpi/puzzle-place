import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/api/hono-client";

type ResponseType = InferResponseType<(typeof client.api)["avatar"]["upload"]["$post"]>;

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (json: { imageData: string }) => {
      const response = await client.api.avatar.upload["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Avatar uploaded successfully!");
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["get-user"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload avatar. Please try again.");
    },
  });

  return mutation;
};