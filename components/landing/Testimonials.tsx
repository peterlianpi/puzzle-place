'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Puzzle Enthusiast',
    content: 'Puzzle Place has transformed how I enjoy games. The community is amazing and the prizes are fantastic!',
    avatar: 'https://via.placeholder.com/100?text=SJ',
  },
  {
    id: 2,
    name: 'Mike Chen',
    role: 'Strategy Gamer',
    content: 'I\'ve never seen a platform that brings together so many different game types. Highly recommended!',
    avatar: 'https://via.placeholder.com/100?text=MC',
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Trivia Lover',
    content: 'The events are well-organized and the interface is so user-friendly. I keep coming back for more!',
    avatar: 'https://via.placeholder.com/100?text=ED',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          What Our Users Say
        </motion.h2>
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-6">
                      &quot;{testimonials[currentIndex].content}&quot;
                    </blockquote>
                    <div className="flex items-center justify-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={testimonials[currentIndex].avatar} alt={testimonials[currentIndex].name} />
                        <AvatarFallback>{testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{testimonials[currentIndex].name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonials[currentIndex].role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}