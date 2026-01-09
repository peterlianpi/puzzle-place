"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const requestedUsername = params.username as string;
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

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
      console.error("Failed to sign out:", error);
      toast.error("Failed to sign out");
    }
  };

  const handleUpdateUsername = () => {
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    if (newUsername.length < 3 || newUsername.length > 20) {
      toast.error("Username must be 3-20 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      toast.error(
        "Username can only contain letters, numbers, and underscores"
      );
      return;
    }

    setUsernameMutation.mutate(
      { username: newUsername },
      {
        onSuccess: () => {
          setEditingUsername(false);
          setNewUsername("");
          // Redirect to new username route
          router.push(`/user/${newUsername}`);
        },
      }
    );
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
            <CardDescription>
              An unexpected error occurred.
            </CardDescription>
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
              ? "Your account has been created successfully"
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
                <AvatarUploader onUploadSuccess={() => queryClient.invalidateQueries({ queryKey: ["user"] })} />
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
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {user.emailVerified ?? false
                      ? "Verified"
                      : "Pending Verification"}
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

              {editingUsername ? (
                <div className="pt-2 space-y-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter new username"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleUpdateUsername}>
                      Save Username
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingUsername(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setEditingUsername(true)}
                  >
                    Edit Username
                  </Button>
                </div>
              )}

              <div className="pt-4 space-y-2">
                <Button className="w-full" onClick={() => router.push("/dashboard")}>
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
                  variant="outline"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
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
