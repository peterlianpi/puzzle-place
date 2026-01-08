"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetEvents } from "@/features/events/api/use-get-events";
import EventList from "@/features/events/components/EventList";

export default function PublicEventsPage() {
  const { data, isLoading, error } = useGetEvents();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-lg text-gray-600 animate-pulse">
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
          <p className="text-red-600 text-lg">Error loading events</p>
          <p className="text-gray-600">
            {error.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  if ("error" in data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-600 text-lg">Error: {data.error}</p>
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const events = data.events;

  return <EventList title="Events" events={events} baseUrl="/events" />;
}
