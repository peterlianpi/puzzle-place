"use client";

import { useGetGameEvents } from "@/features/my-events/api/use-get-game-events";
import EventList from "@/features/events/components/EventList";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Plus, Settings, AlertCircle, Trophy } from "lucide-react";
import Link from "next/link";

export default function GameEventsPage() {
  const { data, isLoading, error, refetch } = useGetGameEvents({ limit: 20, offset: 0 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                <Skeleton className="h-8 w-48" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-4 w-96 max-w-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border p-6 shadow-sm">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-9 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error loading events</AlertTitle>
              <AlertDescription className="mt-2">
                {error?.message || "Please try again later"}
                <button
                  onClick={() => refetch()}
                  className="ml-2 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                  aria-label="Retry loading events"
                >
                  Retry
                </button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No data available</AlertTitle>
              <AlertDescription>
                Unable to load events data. Please check your connection and try again.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if ("error" in data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error: {data.error}</AlertTitle>
              <AlertDescription>
                An error occurred while loading events. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  const events = data.events || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">My Events</h1>
            </div>
            <Link href="/my-events/create-event">
              <Button className="shadow-lg hover:shadow-xl transition-all duration-200" aria-label="Create new event">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Manage your puzzle events, create new competitions, and track your prize pools.
            {events.length === 0 && " Get started by creating your first event!"}
          </p>
        </div>
        <EventList
          title="Game Events"
          events={events}
          baseUrl="/my-events"
          showCreateButton
          showEditButtons
          isLoading={isLoading}
        />
        {events.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first puzzle event to get started. Set up prizes, customize rules, and engage your audience.
            </p>
            <Link href="/my-events/create-event">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Event
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
