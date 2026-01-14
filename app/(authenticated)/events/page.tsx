"use client";

import { useGetEvents } from "@/features/events/api/use-get-events";
import EventList from "@/features/events/components/EventList";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Trophy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PublicEventsPage() {
  const { data, isLoading, error, refetch } = useGetEvents({ limit: 20, offset: 0 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-primary" />
              <Skeleton className="h-8 w-48" />
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
    console.log("Events fetch error", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
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
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No data available</AlertTitle>
            <AlertDescription>
              Unable to load events data. Please check your connection and try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if ("error" in data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error: {String(data.error)}</AlertTitle>
            <AlertDescription>
              An error occurred while loading events. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const events = data.events || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Discover Events</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Join exciting puzzle events and compete for amazing prizes. Explore events created by the community.
          </p>
        </div>
        <EventList
          title="Events"
          events={events}
          baseUrl="/events"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
