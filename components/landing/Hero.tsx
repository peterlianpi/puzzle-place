'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePerformance } from '@/hooks/use-performance';

export default function Hero() {
  const { enableAnimations } = usePerformance();

  if (!enableAnimations) {
    return (
      <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white md:text-6xl lg:text-7xl animate-fade-in">
            Welcome to Puzzle Place
          </h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 md:text-xl lg:text-2xl animate-fade-in-delayed">
            Discover amazing game events, connect with players, and win prizes!
          </p>
          <div className="animate-scale-in">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        {/* Optional background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          className="mb-6 text-4xl font-bold text-gray-900 dark:text-white md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Puzzle Place
        </motion.h1>
        <motion.p
          className="mb-8 text-lg text-gray-600 dark:text-gray-300 md:text-xl lg:text-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Discover amazing game events, connect with players, and win prizes!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Button>
          </Link>
        </motion.div>
      </div>
      {/* Optional background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse"></div>
      </motion.div>
    </section>
  );
}