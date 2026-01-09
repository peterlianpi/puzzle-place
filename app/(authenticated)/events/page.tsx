"use client";

import { useGetEvents } from "@/features/events/api/use-get-events";
import EventList from "@/features/events/components/EventList";
import LoadingSpinner from "@/components/sidebar/LoadingSpinner";
import ErrorMessage from "@/components/error-handler/ErrorMessage";

export default function PublicEventsPage() {
  const { data, isLoading, error } = useGetEvents({ limit: 20, offset: 0 });

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading events..." />;
  }

  if (error) {
    console.error("Events fetch error:", error);
    return (
      <ErrorMessage
        title="Error loading events"
        message={error?.message || "Please try again later"}
      />
    );
  }

  if (!data) {
    return (
      <ErrorMessage
        title="No data available"
        message="Unable to load events data"
      />
    );
  }

  if ("error" in data) {
    return (
      <ErrorMessage
        title={`Error: ${data.error}`}
        message="An error occurred while loading events"
        showBackButton
        backHref="/events"
        backText="Back to Events"
      />
    );
  }

  const events = data.events || [];

  return (
    <EventList
      title="Events"
      events={events}
      baseUrl="/events"
      isLoading={isLoading}
    />
  );
}
