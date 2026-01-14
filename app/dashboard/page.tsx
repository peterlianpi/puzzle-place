"use client";

import { redirect } from "next/navigation";
import { useAuthStatus } from "@/features/auth/api/use-auth-status";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Users,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Gamepad2,
} from "lucide-react";
import { useGetGameEvents } from "@/features/my-events/api/use-get-game-events";
import { useGetHistory } from "@/features/profile/api/use-get-history";








export default function DashboardPage() {
  const { isAuthenticated, user, isLoading } = useAuthStatus();
  const { data: events, isLoading: eventsLoading, error: eventsError } = useGetGameEvents();
  const { data: history, isLoading: historyLoading, error: historyError } = useGetHistory();


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/auth/login?next=/dashboard");
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your events and view your game history
          </p>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="history">My History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">My Events</h2>
              <Button asChild>
                <Link href="/events/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            </div>

            {eventsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : eventsError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error loading events</AlertTitle>
                <AlertDescription>
                  {eventsError.message || "Please try again later"}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(events && 'events' in events ? events.events || [] : []).map((event) => (
                  <Card key={event.EventID} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{event.EventName}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.Description || "No description"}
                          </p>
                        </div>
                        <Badge variant={event.IsActive ? "default" : "secondary"}>
                          {event.IsActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.CreatedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.prizePools?.length || 0} prizes
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/events/${event.EventID}`}>
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/events/${event.EventID}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) || []}
                {((!events || !('events' in events) || (events.events?.length || 0) === 0)) && (
                  <div className="col-span-full text-center py-12">
                    <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first prize event to get started
                    </p>
                    <Button asChild>
                      <Link href="/events/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-semibold">My Game History</h2>

            {historyLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <Skeleton className="h-5 w-48 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : historyError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error loading history</AlertTitle>
                <AlertDescription>
                  {historyError.message || "Please try again later"}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {history?.history?.map((game) => (
                  <Card key={game.HistoryID}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">
                            {game.WonPrizeName || "No prize won"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Event: {game.EventID} • {new Date(game.PlayedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {game.WonPrizeValue ? (
                            <div className="text-lg font-bold text-primary">
                              ${Number(game.WonPrizeValue).toFixed(2)}
                            </div>
                          ) : (
                            <Badge variant="secondary">No prize</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || []}
                {(!history?.history || history.history.length === 0) && (
                  <div className="text-center py-12">
                    <Gamepad2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No games played yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start playing events to see your history here
                    </p>
                    <Button asChild>
                      <Link href="/events">Browse Events</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold">Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Settings functionality coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}