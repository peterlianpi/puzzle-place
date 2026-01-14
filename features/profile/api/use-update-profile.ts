import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      bio?: string;
      theme?: "light" | "dark" | "system";
      language?: string;
      timezone?: string;
      isProfilePublic?: boolean;
      showEmail?: boolean;
      showStats?: boolean;
      showActivity?: boolean;
      allowDataExport?: boolean;
      marketingEmails?: boolean;
      securityEmails?: boolean;
    }) => {
      const response = await client.api.profile.$patch({
        json: data,
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["get-user"] });
      toast.success("Profile updated successfully");
      return data;
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error("Update profile error:", error);
    },
  });
};
