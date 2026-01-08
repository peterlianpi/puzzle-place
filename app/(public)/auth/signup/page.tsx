'use client';

import { GalleryVerticalEnd } from "lucide-react";
import { SignupForm } from "@/components/signup-form";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <motion.div
        className="flex flex-col gap-4 p-6 md:p-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex justify-center gap-2 md:justify-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a href="#" className="flex items-center gap-2 font-medium">
            <motion.div
              className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <GalleryVerticalEnd className="size-4" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Puzzle Place
            </motion.span>
          </a>
        </motion.div>
        <motion.div
          className="flex flex-1 items-center justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="w-full max-w-xs">
            <SignupForm />
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
          src="/logo.jpg"
          alt="Image"
          className="absolute inset-0 h-80 w-96 lef c-1/4 top-1/4 object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </motion.div>
    </div>
  );
}
