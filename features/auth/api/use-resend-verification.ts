import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";

export const useResendVerification = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      // Get current session to get user email
      const session = await authClient.getSession();
      if (!session.data?.user?.email) {
        throw new Error("No user session found");
      }

      await authClient.sendVerificationEmail({
        email: session.data.user.email,
      });
    },
    onSuccess: () => {
      toast.success("Verification email sent! Please check your inbox.");
    },
    onError: (error: Error) => {
      if (error?.message?.includes("already_verified")) {
        toast.info("Your email is already verified.");
      } else {
        toast.error("Failed to send verification email. Please try again.");
      }
    },
  });
  return mutation;
};
