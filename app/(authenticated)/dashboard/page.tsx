"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  Trophy,
  Users,
  Bell,
  Activity,
  Gamepad2,
} from "lucide-react";
import { useGetEvents } from "@/features/events/api/use-get-events";

export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";

const recentActivities = [
  {
    id: 1,
    type: "event",
    title: "Joined Puzzle Championship",
    time: "2 hours ago",
  },
  { id: 2, type: "win", title: "Won Trivia Night", time: "1 day ago" },
  {
    id: 3,
    type: "friend",
    title: "Connected with 3 new players",
    time: "3 days ago",
  },
];

const notifications = [
  {
    id: 1,
    title: "New event invitation",
    message: "You've been invited to Strategy Games",
    unread: true,
  },
  {
    id: 2,
    title: "Prize claimed",
    message: "Your prize from Trivia Night is ready",
    unread: false,
  },
];

export default function DashboardPage() {
  const { data: eventsData, isLoading: eventsLoading } = useGetEvents();

  const upcomingEvents = eventsData?.events.slice(0, 4).map(event => ({
    id: event.EventID,
    title: event.EventName,
    date: new Date(event.CreatedAt).toLocaleDateString(),
    status: 'available' as const,
  })) || [];

  return (
    <motion.div
      className="flex flex-1 flex-col gap-6 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Welcome back to Puzzle Place!
                    </CardTitle>
                    <CardDescription>
                      Here&apos;s what&apos;s happening in your gaming world
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Wins
                      </CardTitle>
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">
                        +2 from last month
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Events Joined
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">+3 this week</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Games Played
                      </CardTitle>
                      <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">89</div>
                      <p className="text-xs text-muted-foreground">
                        +15 this month
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Activities */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Activities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          className="flex items-center space-x-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              activity.type === "win"
                                ? "bg-yellow-500"
                                : activity.type === "event"
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Upcoming Events */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Upcoming Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {eventsLoading ? (
                        [...Array(2)].map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))
                      ) : upcomingEvents.length > 0 ? (
                        upcomingEvents.map((event, index) => (
                          <motion.div
                            key={event.id}
                            className="flex items-center justify-between"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                          >
                            <div>
                              <p className="text-sm font-medium">{event.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {event.date}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {event.status}
                            </Badge>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No upcoming events
                        </p>
                      )}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                      >
                        <Link href="/events">
                          <Button variant="outline" className="w-full">
                            View All Events
                          </Button>
                        </Link>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        className="flex items-start space-x-4 p-3 rounded-lg border"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      >
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
    </motion.div>
  );
}

