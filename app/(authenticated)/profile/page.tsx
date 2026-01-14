"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Settings,
  Shield,
  Palette,
  AlertCircle,
  Trophy,
  Calendar,
  Mail,
  UserCheck,
  BarChart3,
  LogOut,
  Trash2
} from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProfileSettings } from "@/features/profile/components/ProfileSettings";
import { ProfilePrivacy } from "@/features/profile/components/ProfilePrivacy";
import { ProfilePreferences } from "@/features/profile/components/ProfilePreferences";
import { ProfileActions } from "@/features/profile/components/ProfileActions";
import { useGetProfile } from "@/features/profile/api/use-get-profile";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const {
    data: session,
    isPending: sessionLoading,
    error: sessionError,
  } = authClient.useSession();

  const { data: profile, isLoading: profileLoading } = useGetProfile();

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Skeleton className="h-10 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (sessionError || !session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                You need to be logged in to view your profile.
                <Link href="/auth/login" className="block mt-2">
                  <Button variant="outline">Go to Login</Button>
                </Link>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  const user = session.user;
  const isCurrentUser = true; // Since this is the authenticated profile page

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // Implement account deletion
        toast.error("Account deletion not implemented yet");
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg">
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
                <p className="text-muted-foreground">
                  Manage your account settings, privacy, and preferences
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="border-0 shadow-sm bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Status</p>
                      <p className="font-medium">
                        {user.emailVerified ? (
                          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Unverified</Badge>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Trophy className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Events Created</p>
                      <p className="font-medium">12</p> {/* TODO: Get from API */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <Calendar className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfileActions
                isCurrentUser={isCurrentUser}
                onSignOut={handleSignOut}
                onDeleteAccount={handleDeleteAccount}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <ProfileSettings user={user} isCurrentUser={isCurrentUser} />
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <ProfilePrivacy user={user} isCurrentUser={isCurrentUser} />
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <ProfilePreferences user={user} isCurrentUser={isCurrentUser} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}