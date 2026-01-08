"use client";

import { useParams } from "next/navigation";
import { useGetGameEvent } from "@/features/my-events/api/use-get-game-event";
import CreateEventForm from "@/features/my-events/components/CreateEventForm";

export default function EditEventPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, error } = useGetGameEvent(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-600 text-lg">Error loading event</p>
          <p className="text-gray-600">{error.message || "Please try again later"}</p>
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

  if ('error' in data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-600 text-lg">Error: {data.error}</p>
        </div>
      </div>
    );
  }

  const event = data.event;

  // Transform the event data to match the form's expected format
  const eventForForm = {
    eventId: event.EventID,
    eventName: event.EventName,
    description: event.Description || "",
    prizes: event.prizePools.map((prize) => ({
      name: prize.PrizeName,
      value: parseFloat(prize.PrizeValue || '0'),
      isBlank: prize.IsBlank,
    })),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
      <CreateEventForm mode="update" event={eventForForm} />
    </div>
  );
}