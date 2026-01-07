"use client";

import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChangePasswordForm } from "@/components/change-password-form";
import { authClient } from '@/lib/auth/auth-client';

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
}

export default function ChangePasswordPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Puzzle Place
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          width={100}
          height={100}
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}