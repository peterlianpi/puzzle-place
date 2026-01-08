'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useGetUsers } from '@/features/users/api/use-get-users';
import { usePerformance } from '@/hooks/use-performance';
import { useVisibility } from '@/hooks/use-visibility';

// Static placeholder users for slow connections
const staticUsers = [
  {
    id: '1',
    name: 'Alex Chen',
    username: 'alexchen',
    image: 'https://picsum.photos/150/150?random=10',
    rank: 1,
    bio: 'Puzzle master and community leader.',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    username: 'sarahj',
    image: 'https://picsum.photos/150/150?random=11',
    rank: 2,
    bio: 'Trivia champion and event organizer.',
  },
  {
    id: '3',
    name: 'Mike Davis',
    username: 'miked',
    image: 'https://picsum.photos/150/150?random=12',
    rank: 3,
    bio: 'Strategy expert and top contributor.',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    username: 'emmaw',
    image: 'https://picsum.photos/150/150?random=13',
    rank: 4,
    bio: 'Quick quiz specialist and moderator.',
  },
];

export default function TopUsers() {
  const { enableApiCalls, enableAnimations, imageQuality } = usePerformance();
  const [ref, isVisible] = useVisibility();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: usersData, isLoading } = useGetUsers(
    enableApiCalls ? {} : {  }
  );

  const users = enableApiCalls
    ? (usersData?.slice(0, 4).map((user, index) => ({
        ...user,
        rank: index + 1,
        bio: 'Active player and contributor to the community.',
      })) || [])
    : staticUsers.map(user => ({
        ...user,
        image: imageQuality === 'low' ? `https://via.placeholder.com/100?text=${user.name.split(' ').map(n => n[0]).join('')}` : user.image,
      }));

  useEffect(() => {
    if (users.length > 0 && isVisible) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
      }, enableAnimations ? 4000 : 6000); // Slower for non-animated version
      return () => clearInterval(interval);
    }
  }, [users.length, isVisible, enableAnimations]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <Skeleton className="w-48 h-8 mx-auto mb-12" />
          <Skeleton className="w-24 h-24 mx-auto mb-4" />
          <Skeleton className="w-32 h-6 mx-auto mb-2" />
          <Skeleton className="w-20 h-4 mx-auto mb-4" />
          <Skeleton className="w-64 h-4 mx-auto" />
        </div>
      </section>
    );
  }

  if (users.length === 0) {
    return null;
  }

  if (!enableAnimations) {
    return (
      <section ref={ref} className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white animate-fade-in">
            Top Users
          </h2>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md text-center">
              <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <Link href={`/user/${users[currentIndex]?.username || users[currentIndex]?.id}`}>
                  <Avatar className="w-24 h-24 mx-auto mb-4 hover:scale-105 transition-transform">
                    <AvatarImage src={users[currentIndex]?.image || ''} alt={users[currentIndex]?.name || users[currentIndex]?.username || ''} />
                    <AvatarFallback>{(users[currentIndex]?.name || users[currentIndex]?.username || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {users[currentIndex]?.name || users[currentIndex]?.username}
                </h3>
                <Badge variant="outline" className="mb-2">
                  Rank #{users[currentIndex]?.rank}
                </Badge>
                <p className="text-gray-600 dark:text-gray-300">{users[currentIndex]?.bio}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8 space-x-2">
            {users.map((_, index) => (
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

  return (
    <section ref={ref} className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Top Users
        </motion.h2>
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Link href={`/user/${users[currentIndex].username || users[currentIndex].id}`}>
                  <Avatar className="w-24 h-24 mx-auto mb-4 hover:scale-105 transition-transform">
                    <AvatarImage src={users[currentIndex].image || ''} alt={users[currentIndex].name || users[currentIndex].username||''} />
                    <AvatarFallback>{(users[currentIndex].name || users[currentIndex].username || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {users[currentIndex].name || users[currentIndex].username}
                </h3>
                <Badge variant="outline" className="mb-2">
                  Rank #{users[currentIndex].rank}
                </Badge>
                <p className="text-gray-600 dark:text-gray-300">{users[currentIndex].bio}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-center mt-8 space-x-2">
          {users.map((_, index) => (
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