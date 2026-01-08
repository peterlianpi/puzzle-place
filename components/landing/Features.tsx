'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, Gamepad2, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Create Events',
    description: 'Easily create and manage your own game events with custom prizes and rules.',
  },
  {
    icon: Users,
    title: 'Join Communities',
    description: 'Connect with fellow gamers and join exciting events from around the world.',
  },
  {
    icon: Trophy,
    title: 'Win Prizes',
    description: 'Compete for real prizes and showcase your skills in various game categories.',
  },
  {
    icon: Gamepad2,
    title: 'Multiple Game Types',
    description: 'Enjoy puzzles, trivia, strategy games, and more in one platform.',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Stay updated with live event notifications and instant results.',
  },
  {
    icon: Shield,
    title: 'Secure & Fair',
    description: 'Play with confidence in our secure, fair, and transparent environment.',
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why Choose Puzzle Place?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
                <feature.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}