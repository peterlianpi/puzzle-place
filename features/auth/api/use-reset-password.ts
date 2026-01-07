import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";

export const useResetPassword = () => {
  const mutation = useMutation({
    mutationFn: async (json: { newPassword: string; token: string }) => {
      await authClient.resetPassword({
        newPassword: json.newPassword,
        token: json.token,
      });
    },
    onSuccess: () => {
      toast.success("Password reset successfully! You can now log in with your new password.");
    },
    onError: (error: Error) => {
      if (error?.message?.includes("invalid_token")) {
        toast.error("Invalid or expired reset token. Please request a new password reset.");
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    },
  });
  return mutation;
};