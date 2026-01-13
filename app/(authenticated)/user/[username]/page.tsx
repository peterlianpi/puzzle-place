"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useResendVerification } from "@/features/auth/api/use-resend-verification";
import { useGetUser } from "@/features/auth/api/use-get-user";
import { useGetUserByUsername } from "@/features/users/api/use-get-user-by-username";
import { useSetUsername } from "@/features/auth/api/use-set-username";
import { AvatarUploader } from "@/features/avatar/components/avatar-uploader";
import { ClientLogger } from "@/lib/client-logger";
import { Check } from "lucide-react";
import Image from "next/image";

interface User {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  emailVerified?: boolean | null;
  image?: string | null;
  createdAt: Date;
}

interface InlineEditProps {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  validator?: (value: string) => string | null;
  onSave: (value: string) => Promise<void>;
  buttonText?: string;
}

function InlineEdit({
  label,
  value,
  placeholder,
  type = "text",
  validator,
  onSave,
  buttonText = "Save",
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const handleSave = async () => {
    const validationError = validator ? validator(editValue) : null;
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
      setEditValue("");
    } catch (error) {
      // Error is handled in onSave
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : buttonText}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button variant="outline" className="w-full" onClick={handleEdit}>
        {label}
      </Button>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const requestedUsername = params.username as string;

  const { data: currentUserData, isLoading: isCurrentUserLoading } =
    useGetUser();
  const {
    data: requestedUserData,
    isLoading: isRequestedUserLoading,
    error: requestedUserError,
  } = useGetUserByUsername({
    username: requestedUsername,
  });
  const resendVerificationMutation = useResendVerification();
  const setUsernameMutation = useSetUsername();

  const currentUser = currentUserData?.user;
  const requestedUser = requestedUserData?.user;
  const isCurrentUser = currentUser?.username === requestedUsername;
  const isLoading =
    isCurrentUserLoading || (isRequestedUserLoading && !isCurrentUser);
  const user = isCurrentUser ? currentUser : requestedUser;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/auth/login");
    } catch (error) {
      ClientLogger.devLog("Failed to sign out", error);
      toast.error("Failed to sign out");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await authClient.deleteUser();
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error) {
      ClientLogger.devLog("Failed to delete account", error);
      toast.error("Failed to delete account");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (requestedUserError && !isCurrentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">User Not Found</CardTitle>
            <CardDescription>
              The user @{requestedUsername} does not exist.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">User Not Found</CardTitle>
            <CardDescription>An unexpected error occurred.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isCurrentUser
              ? "Welcome to Puzzle Place!"
              : `${user.name || "User"}'s Profile`}
          </CardTitle>
          <CardDescription>
            {isCurrentUser
              ? "Manage your profile and account settings"
              : `View ${user.name || "User"}'s public profile`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto overflow-hidden">
              {user.image ? (
                <Image
                  width={100}
                  height={100}
                  src={user.image}
                  alt={`${user.name || "User"}'s avatar`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl text-primary-foreground font-bold">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </span>
              )}
            </div>
            {isCurrentUser && (
              <div className="mt-2">
                <AvatarUploader
                  onUploadSuccess={() =>
                    queryClient.invalidateQueries({ queryKey: ["user"] })
                  }
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">
                {user.name || "Unknown"}
              </h3>
              <p className="text-muted-foreground">
                {user.username ? `@${user.username}` : ""}
              </p>
              {isCurrentUser && (
                <p className="text-muted-foreground text-sm">{user.email}</p>
              )}
            </div>
          </div>

          {isCurrentUser ? (
            <>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Account Status:</span>
                  <span
                    className={
                      user.emailVerified ?? false
                        ? "text-green-600 flex items-center gap-1"
                        : "text-red-600"
                    }
                  >
                    {user.emailVerified ?? false ? (
                      <>
                        <Check className="h-4 w-4" />
                        Verified
                      </>
                    ) : (
                      "Pending Verification"
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Member Since:</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {!user.emailVerified && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resendVerificationMutation.mutate()}
                    disabled={resendVerificationMutation.isPending}
                    className="w-full"
                  >
                    {resendVerificationMutation.isPending
                      ? "Sending..."
                      : "Resend Verification Email"}
                  </Button>
                </div>
              )}

              {/* Account Settings Section */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Account Settings
                </h4>

                <InlineEdit
                  label="Edit Name"
                  value={user.name || ""}
                  placeholder="Enter your display name"
                  validator={(value) =>
                    !value.trim() ? "Name cannot be empty" : null
                  }
                  onSave={async (value) => {
                    try {
                      await authClient.updateUser({ name: value });
                      toast.success("Name updated successfully");
                      queryClient.invalidateQueries({ queryKey: ["user"] });
                      queryClient.invalidateQueries({ queryKey: ["get-user"] });
                    } catch (error) {
                      console.error("Failed to update name:", error);
                      toast.error("Failed to update name");
                      throw error;
                    }
                  }}
                />

                <InlineEdit
                  label="Edit Username"
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
                    setUsernameMutation.mutate(
                      { username: value },
                      {
                        onSuccess: () => {
                          toast.success("Username updated successfully");
                          router.push(`/user/${value}`);
                        },
                        onError: (error) => {
                          toast.error(
                            error.message || "Failed to update username"
                          );
                          throw error;
                        },
                      }
                    );
                  }}
                />

                <InlineEdit
                  label="Change Email"
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
                    try {
                      await authClient.changeEmail({
                        newEmail: value,
                        callbackURL: "/dashboard",
                      });
                      toast.success(
                        "Email change initiated. Please check your email for verification."
                      );
                    } catch (error) {
                      console.error("Failed to change email:", error);
                      toast.error("Failed to change email");
                      throw error;
                    }
                  }}
                  buttonText="Send Verification"
                />
              </div>

              {/* Actions Section */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Quick Actions
                </h4>

                <div className="grid grid-cols-1 gap-2">
                  <Button
                    className="w-full"
                    onClick={() => router.push("/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/auth/change-password")}
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="pt-4 space-y-2 text-center">
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <div className="pt-4">
                <Button
                  className="w-full"
                  onClick={() => router.push("/auth/login")}
                >
                  Login to View More
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
