"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Lock } from "lucide-react";

interface LoginPromptBannerProps {
  title?: string;
  message?: string;
  action?: string;
  className?: string;
  redirect?: string;
}

export default function LoginPromptBanner({
  title = "Login Required",
  message = "You need to be logged in to access this feature.",
  action = "Login to Continue",
  className = "",
  redirect,
}: LoginPromptBannerProps) {
  return (
    <div
      className={`fixed inset-0 max-sm:p-4 bg-black/50 flex items-center justify-center z-50 ${className}`}
    >
      <Card className="p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6">{message}</p>
          <div className="flex gap-3 justify-center flex-col sm:flex-row">
            <Link
              href={`/auth/login${
                redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""
              }`}
            >
              <Button className="max-sm:w-full">{action}</Button>
            </Link>
            <Link
              href={`/auth/signup${
                redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""
              }`}
            >
              <Button className="max-sm:w-full" variant="outline">
                Sign Up
              </Button>
            </Link>
            <Button
              className="max-sm:w-full"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Back
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
