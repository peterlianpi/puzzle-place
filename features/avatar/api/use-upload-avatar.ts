import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/api/hono-client";
import { Logger } from "@/lib/logger";

type SuccessResponse = { success: true; imageUrl: string };
type ErrorResponse = { error: string };
type ResponseType = SuccessResponse | ErrorResponse;

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (json: { imageData: string }) => {
      const response = await client.api.avatar.upload["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: (data: ResponseType) => {
      if ('imageUrl' in data) {
        Logger.devLog("[AVATAR] Upload success, new image URL:", data.imageUrl);
        toast.success("Avatar uploaded successfully!");
        // Invalidate user-related queries
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["get-user"] });
      } else if ('error' in data) {
        // Handle API error responses
        toast.error(data.error || "Failed to upload avatar. Please try again.");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload avatar. Please try again.");
    },
  });

  return mutation;
};