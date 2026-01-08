"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEvents } from "@/features/events/api/use-get-events";
import { usePerformance } from "@/hooks/use-performance";

type EventData = {
  Description: string | null;
  prizePools: {
    PrizeValue: string;
    DisplayOrder: number;
    PrizeID: number;
    PrizeName: string;
    IsBlank: boolean;
  }[];
  EventID: number;
  CreatorUserID: string;
  EventName: string;
  IsActive: boolean;
  CreatedAt: string;
};

// Static placeholder events for slow connections
const staticEvents = [
  {
    id: 1,
    title: "Puzzle Master Challenge",
    description: "Test your puzzle-solving skills in this ultimate challenge!",
    date: "2024-01-15",
    location: "Online",
    image: "https://picsum.photos/400/250?random=1",
  },
  {
    id: 2,
    title: "Trivia Night Special",
    description: "Show off your knowledge in our weekly trivia event.",
    date: "2024-01-20",
    location: "Online",
    image: "https://picsum.photos/400/250?random=2",
  },
  {
    id: 3,
    title: "Strategy Showdown",
    description: "Battle it out in strategic games with amazing prizes.",
    date: "2024-01-25",
    location: "Online",
    image: "https://picsum.photos/400/250?random=3",
  },
  {
    id: 4,
    title: "Quick Quiz Tournament",
    description: "Fast-paced quiz competition for quick thinkers.",
    date: "2024-01-30",
    location: "Online",
    image: "https://picsum.photos/400/250?random=4",
  },
];

export default function PopularEvents() {
  const { enableApiCalls, imageQuality } = usePerformance();

  const { data: eventsData, isLoading } = useGetEvents(
    enableApiCalls ? { limit: 4 } : { enabled: false }
  );

  const events = enableApiCalls
    ? eventsData?.events.slice(0, 4).map((event: EventData) => ({
        id: event.EventID,
        title: event.EventName,
        description: event.Description || "Exciting game event!",
        date: new Date(event.CreatedAt).toLocaleDateString(),
        location: "Online",
        image:
          imageQuality === "low"
            ? `https://picsum.photos/200/150?random=${event.EventID % 100}`
            : `https://picsum.photos/400/250?random=${event.EventID % 100}`,
      })) || []
    : staticEvents.map(event => ({
        ...event,
        image: imageQuality === "low"
          ? event.image.replace('/400/250', '/200/150')
          : event.image,
      }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Skeleton className="w-48 h-8 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

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
          Popular Events
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {events.map((event) => (
            <motion.div key={event.id} variants={itemVariants}>
              <Link href={`/events/${event.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-t-lg"
                      priority={false}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="mb-2 text-lg">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="mb-4">
                      {event.description}
                    </CardDescription>
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{event.date}</span>
                      <Badge variant="secondary">{event.location}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
