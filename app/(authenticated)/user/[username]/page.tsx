"use client";

import { useCallback, useMemo } from "react";
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
import { useGetUser } from "@/features/auth/api/use-get-user";
import { useGetUserByUsername } from "@/features/users/api/use-get-user-by-username";
import { ClientLogger } from "@/lib/client-logger";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileStats } from "@/features/profile/components/ProfileStats";
import { ProfileSettings } from "@/features/profile/components/ProfileSettings";
import { ProfileActions } from "@/features/profile/components/ProfileActions";
import { InlineEdit } from "@/components/ui/inline-edit";
import { AvatarUploader } from "@/features/avatar/components/avatar-uploader";
import { Check } from "lucide-react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useResendVerification } from "@/features/auth/api/use-resend-verification";
import { useSetUsername } from "@/features/auth/api/use-set-username";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfilePrivacy } from "@/features/profile/components/ProfilePrivacy";
import { ProfilePreferences } from "@/features/profile/components/ProfilePreferences";

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
  const isCurrentUser = useMemo(
    () => currentUser?.username === requestedUsername,
    [currentUser?.username, requestedUsername]
  );
  const isLoading = useMemo(
    () => isCurrentUserLoading || (isRequestedUserLoading && !isCurrentUser),
    [isCurrentUserLoading, isRequestedUserLoading, isCurrentUser]
  );
  const user = useMemo(
    () => (isCurrentUser ? currentUser : requestedUser),
    [isCurrentUser, currentUser, requestedUser]
  );

  const handleSignOut = useCallback(async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/auth/login");
    } catch (error) {
      console.log("Failed to sign out", error);
      toast.error("Failed to sign out");
    }
  }, [router]);

  const handleDeleteAccount = useCallback(async () => {
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
      console.log("Failed to delete account", error);
      toast.error("Failed to delete account");
    }
  }, [router]);

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
    <div className="space-y-0">
      {/* Hero Header */}
      <ProfileHeader user={user} isCurrentUser={isCurrentUser} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
        {isCurrentUser ? (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto mb-6 md:mb-8 gap-1 md:gap-0">
              <TabsTrigger value="profile" className="text-xs md:text-sm px-2 md:px-3 py-2 md:py-1.5">
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs md:text-sm px-2 md:px-3 py-2 md:py-1.5">
                Settings
              </TabsTrigger>
              <TabsTrigger value="privacy" className="text-xs md:text-sm px-2 md:px-3 py-2 md:py-1.5">
                Privacy
              </TabsTrigger>
              <TabsTrigger value="preferences" className="text-xs md:text-sm px-2 md:px-3 py-2 md:py-1.5">
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                {/* Left Column - Stats */}
                <div className="xl:col-span-2 space-y-6 md:space-y-8 order-2 xl:order-1">
                  <ProfileStats user={user} isCurrentUser={isCurrentUser} />
                </div>

                {/* Right Column - Actions */}
                <div className="space-y-6 md:space-y-8 order-1 xl:order-2">
                  <ProfileActions
                    isCurrentUser={isCurrentUser}
                    onSignOut={handleSignOut}
                    onDeleteAccount={handleDeleteAccount}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
              <ProfileSettings user={user} isCurrentUser={isCurrentUser} />
            </TabsContent>

            <TabsContent value="privacy" className="space-y-8">
              <ProfilePrivacy user={user} isCurrentUser={isCurrentUser} />
            </TabsContent>

            <TabsContent value="preferences" className="space-y-8">
              <ProfilePreferences user={user} isCurrentUser={isCurrentUser} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Stats */}
            <div className="xl:col-span-2 space-y-6 md:space-y-8 order-2 xl:order-1">
              <ProfileStats user={user} isCurrentUser={isCurrentUser} />
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6 md:space-y-8 order-1 xl:order-2">
              <ProfileActions
                isCurrentUser={isCurrentUser}
                onSignOut={handleSignOut}
                onDeleteAccount={handleDeleteAccount}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
