import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";

export const useForgotPassword = () => {
  const mutation = useMutation({
    mutationFn: async (json: { email: string }) => {
      await authClient.requestPasswordReset({
        email: json.email,
      });
    },
    onSuccess: () => {
      toast.success("Password reset link sent successfully! 📧", {
        description: "Check your email inbox and spam folder. The link will expire in 24 hours.",
        duration: 6000,
      });
    },
    onError: (error: Error) => {
      console.error("Password reset error:", error);
      toast.error("Failed to send password reset email. Please try again.", {
        description: error.message || "Check your internet connection and try again.",
        duration: 5000,
      });
    },
  });
  return mutation;
};
