"use client";

import { useGetGameEvents } from "@/features/my-events/api/use-get-game-events";
import EventList from "@/features/events/components/EventList";

export default function GameEventsPage() {
  const { data, isLoading, error } = useGetGameEvents({ limit: 20, offset: 0 });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-lg text-muted-foreground animate-pulse">
            Loading events...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive text-lg">Error loading events</p>
          <p className="text-muted-foreground">
            {error?.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  if ("error" in data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive text-lg">Error: {data.error}</p>
        </div>
      </div>
    );
  }

  const events = data.events || [];

  return (
    <EventList
      title="Game Events"
      events={events}
      baseUrl="/my-events"
      showCreateButton
      showEditButtons
      isLoading={isLoading}
    />
  );
}
