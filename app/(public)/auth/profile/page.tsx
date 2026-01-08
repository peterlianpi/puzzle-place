"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
            router.replace("/auth/profile");
          }
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Failed to get user:", error);
        router.push("/auth/login");
      }
    };

    redirectToUsername();
  }, [router]);

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
          Redirecting to your profile...
        </motion.p>
      </div>
    </motion.div>
  );
}
