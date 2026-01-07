"use client";

import { useEffect, useState } from "react";
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
import { useResendVerification } from "@/features/auth/api/use-resend-verification";

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const requestedUsername = params.username as string;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const resendVerificationMutation = useResendVerification();

  useEffect(() => {
    const getUser = async () => {
      try {
        // First, try to get current authenticated user
        const authResponse = await fetch("/api/auth/get-user");
        let currentUser = null;

        if (authResponse.ok) {
          const { user } = await authResponse.json();
          currentUser = user;
        }
        // Note: Don't redirect on auth failure - allow public access

        // Check if this is the current user's profile
        if (currentUser && currentUser.username === requestedUsername) {
          // Show editable profile for current user
          setUser(currentUser);
          setIsCurrentUser(true);
        } else {
          // Try to get the requested user (public view)
          const publicResponse = await fetch(`/api/users/${requestedUsername}`);
          if (publicResponse.ok) {
            const { user: publicUser } = await publicResponse.json();
            setUser(publicUser);
            setIsCurrentUser(!!currentUser && currentUser.username === requestedUsername);
          } else if (publicResponse.status === 404) {
            // User not found
            router.push("/404");
            return;
          } else {
            // Other error - show a generic error or fallback
            setUser({
              id: "error",
              name: "User",
              username: requestedUsername,
              email: "",
              emailVerified: false,
              createdAt: new Date(),
            } as User);
            setIsCurrentUser(false);
          }
        }
      } catch (error) {
        console.error("Failed to get user:", error);
        // Show error state instead of redirecting
        setUser({
          id: "error",
          name: "Error",
          username: requestedUsername,
          email: "",
          emailVerified: false,
          createdAt: new Date(),
        } as User);
        setIsCurrentUser(false);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [router, requestedUsername]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
      toast.error("Failed to sign out");
    }
  };

  const handleUpdateUsername = async () => {
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
    // Update username via API
    try {
      const response = await fetch("/api/auth/set-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to update username");
        return;
      }

      setUser({ ...user, username: newUsername } as User);
      toast.success("Username updated successfully");
      setEditingUsername(false);
      setNewUsername("");
      // Redirect to new username route
      router.push(`/${newUsername}`);
    } catch (error) {
      console.error("Update username error:", error);
      toast.error("Failed to update username");
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

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isCurrentUser ? "Welcome to Puzzle Place!" : `${user.name}'s Profile`}
          </CardTitle>
          <CardDescription>
            {isCurrentUser
              ? "Your account has been created successfully"
              : `View ${user.name}'s public profile`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl text-primary-foreground font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">@{user.username}</p>
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
                      user.emailVerified ? "text-green-600" : "text-yellow-600"
                    }
                  >
                    {user.emailVerified ? "Verified" : "Pending Verification"}
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
                <Button className="w-full" onClick={() => router.push("/")}>
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/change-password")}
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
                <Button className="w-full" onClick={() => router.push("/login")}>
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
