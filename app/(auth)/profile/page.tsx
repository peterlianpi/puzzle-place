"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectToUsername = async () => {
      try {
        // Get user with username from DB
        const response = await fetch("/api/auth/get-user");
        if (response.ok) {
          const { user } = await response.json();
          if (user.username) {
            router.replace(`/@${user.username}`);
          } else {
            // Username not set, stay on profile (could allow setting here)
            router.replace("/profile");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to get user:", error);
        router.push("/login");
      }
    };

    redirectToUsername();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to your profile...</p>
      </div>
    </div>
  );
}
