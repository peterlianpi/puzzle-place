"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleVerification = async () => {
      try {
        // Get the token from URL parameters
        const token = searchParams.get("token");

        if (!token) {
          setError(
            "No verification token found. Please check your email for the correct link."
          );
          setIsVerifying(false);
          return;
        }

        console.log("Verifying email with token:", token);

        // Use Better Auth's verifyEmail method with the token
        const result = await authClient.verifyEmail({
          query: {
            token,
            callbackURL: "/",
          },
        });

        if (result.error) {
          console.error("Email verification error:", result.error);
          setError(
            result.error.message ||
              "Failed to verify email. The link may have expired."
          );
        } else {
          console.log("Email verification successful");
          toast.success(
            "Email verified successfully! Welcome to Puzzle Place!",
            {
              duration: 5000,
            }
          );
          // Redirect to profile page after showing success message
          setTimeout(() => {
            router.push("/auth/profile?message=email-verified");
          }, 3000);
        }
      } catch (err) {
        console.error("Verification failed:", err);
        setError(
          "An unexpected error occurred during verification. Please try again."
        );
      } finally {
        setIsVerifying(false);
      }
    };

    handleVerification();
  }, [searchParams, router]);

  if (isVerifying) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-xs flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Puzzle Place
          </a>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <div>
                  <h2 className="text-lg font-semibold">
                    Verifying your email...
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Please wait while we verify your email address.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-xs flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Puzzle Place
          </a>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">
                Verification Failed
              </CardTitle>
              <CardDescription>
                We encountered an error while verifying your email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={() => router.push("/auth/profile")}
                    className="w-full"
                  >
                    Go to Profile
                  </Button>
                  <Button
                    onClick={() => router.push("/auth/login")}
                    variant="outline"
                    className="w-full"
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-xs flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Puzzle Place
        </a>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-4xl">✅</div>
              <p className="text-sm text-muted-foreground">
                You can now access all features of Puzzle Place.
              </p>
              <Button
                onClick={() => router.push("/auth/profile")}
                className="w-full"
              >
                Continue to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading verification...</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
