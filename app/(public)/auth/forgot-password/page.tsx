'use client';

import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { AuthBranding } from "@/components/auth/AuthBranding";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
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
            <ForgotPasswordForm />
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
