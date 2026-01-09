"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { motion } from "framer-motion";

interface AuthBrandingProps {
  className?: string;
}

export function AuthBranding({ className = "" }: AuthBrandingProps) {
  return (
    <motion.div
      className={`flex justify-center gap-2 ${className}`}
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
  );
}