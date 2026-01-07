"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const resendVerificationMutation = useResendVerification();
  console.log("User : ", user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data?.user) {
          setUser(session.data.user as User);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to get user session:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [router]);

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
          <CardTitle className="text-2xl">Welcome to Puzzle Place!</CardTitle>
          <CardDescription>
            Your account has been created successfully
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
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

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
        </CardContent>
      </Card>
    </div>
  );
}
