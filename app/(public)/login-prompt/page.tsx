"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPromptPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleLogin = () => {
    router.push(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            You need to log in to access this page. Please choose how you&apos;d
            like to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleLogin} className="w-full">
            Login to Continue
          </Button>
          <Button onClick={handleGoBack} variant="outline" className="w-full">
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
