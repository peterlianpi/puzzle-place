"use client";

import Image from "next/image";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChangePasswordForm } from "@/components/change-password-form";
import { AuthBranding } from "@/components/auth/AuthBranding";
import { authClient } from "@/lib/auth/auth-client";
import { motion } from "framer-motion";

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
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Failed to get user session:", error);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [router]);

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          ></motion.div>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Loading...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <motion.div
        className="flex flex-col gap-4 p-6 md:p-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AuthBranding />
        <motion.div
          className="flex flex-1 items-center justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="w-full max-w-xs">
            <ChangePasswordForm />
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        className="bg-muted relative hidden lg:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Image
          width={100}
          height={100}
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </motion.div>
    </div>
  );
}
