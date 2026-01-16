"use client";

import { Button } from "@/components/ui/button";
import { GoogleLogoIcon } from "@phosphor-icons/react";
import { authClient } from "@/lib/auth/auth-client";

interface GoogleSignInButtonProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  errorMessage: string;
  children: React.ReactNode;
  redirectTo?: string;
}

export function GoogleSignInButton({
  loading,
  setLoading,
  setError,
  errorMessage,
  children,
  redirectTo,
}: GoogleSignInButtonProps) {
  const handleGoogleSignIn = async () => {
    const safeRedirectUrl = redirectTo && !redirectTo.startsWith("/auth/") ? redirectTo : "/dashboard";
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: safeRedirectUrl,
      },
      {
        onRequest: () => {
          setLoading(true);
          setError(null);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: (ctx) => {
          setError(ctx.error.message || errorMessage);
        },
        onSuccess: () => {
          // Manual redirect for Google sign-in
          window.location.href = safeRedirectUrl;
        },
      }
    );
  };

  return (
    <Button
      variant="outline"
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
    >
      <GoogleLogoIcon className="size-5" />
      {loading ? "Connecting..." : children}
    </Button>
  );
}
