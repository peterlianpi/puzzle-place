import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InlineEdit } from "@/components/ui/inline-edit";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useResendVerification } from "@/features/auth/api/use-resend-verification";
import { useSetUsername } from "@/features/auth/api/use-set-username";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Edit3 } from "lucide-react";

interface ProfileSettingsProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    username?: string | null;
    emailVerified?: boolean | null;
  };
  isCurrentUser: boolean;
}

export function ProfileSettings({ user, isCurrentUser }: ProfileSettingsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resendVerificationMutation = useResendVerification();
  const setUsernameMutation = useSetUsername();

  if (!isCurrentUser) return null;

  return (
    <div className="space-y-6">
      {/* Account Settings */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Edit3 className="h-5 w-5 text-blue-600" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InlineEdit
            label="Display Name"
            value={user.name || ""}
            placeholder="Enter your display name"
            validator={(value) => {
              if (!value.trim()) return "Name cannot be empty";
              if (value.length > 50) return "Name must be 50 characters or less";
              return null;
            }}
            onSave={async (value) => {
              await authClient.updateUser({ name: value });
              toast.success("Name updated successfully");
              queryClient.invalidateQueries({ queryKey: ["user"] });
              queryClient.invalidateQueries({ queryKey: ["get-user"] });
            }}
          />

          <InlineEdit
            label="Username"
            value={user.username || ""}
            placeholder="Enter new username"
            validator={(value) => {
              if (!value.trim()) return "Username cannot be empty";
              if (value.length < 3 || value.length > 20)
                return "Username must be 3-20 characters";
              if (!/^[a-zA-Z0-9_]+$/.test(value))
                return "Username can only contain letters, numbers, and underscores";
              return null;
            }}
            onSave={async (value) => {
              await new Promise((resolve, reject) => {
                setUsernameMutation.mutate(
                  { username: value },
                  {
                    onSuccess: () => {
                      toast.success("Username updated successfully");
                      router.push(`/user/${value}`);
                      resolve(undefined);
                    },
                    onError: (error) => {
                      toast.error(
                        error.message || "Failed to update username"
                      );
                      reject(error);
                    },
                  }
                );
              });
            }}
          />

          <InlineEdit
            label="Email Address"
            value=""
            placeholder="Enter new email address"
            type="email"
            validator={(value) => {
              if (!value.trim()) return "Email cannot be empty";
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                return "Please enter a valid email address";
              return null;
            }}
            onSave={async (value) => {
              await authClient.changeEmail({
                newEmail: value,
                callbackURL: "/dashboard",
              });
              toast.success(
                "Email change initiated. Please check your email for verification."
              );
            }}
            buttonText="Send Verification"
          />
        </CardContent>
      </Card>

      {/* Email Verification Status */}
      {!user.emailVerified && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div>
                  <h4 className="font-medium text-amber-900 dark:text-amber-100">
                    Email Verification Required
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Please verify your email address to access all features and ensure account security.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resendVerificationMutation.mutate()}
                  disabled={resendVerificationMutation.isPending}
                  className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950"
                >
                  {resendVerificationMutation.isPending
                    ? "Sending..."
                    : "Resend Verification Email"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {user.emailVerified && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  Email Verified
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your email address has been verified successfully.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}