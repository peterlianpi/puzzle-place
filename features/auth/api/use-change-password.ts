import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";

export const useChangePassword = () => {
  const mutation = useMutation({
    mutationFn: async (json: {
      currentPassword: string;
      newPassword: string;
      revokeOtherSessions?: boolean;
    }) => {
      await authClient.changePassword({
        currentPassword: json.currentPassword,
        newPassword: json.newPassword,
        revokeOtherSessions: json.revokeOtherSessions,
      });
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error: Error) => {
      if (error?.message?.includes("invalid_password")) {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to change password. Please try again.");
      }
    },
  });
  return mutation;
};