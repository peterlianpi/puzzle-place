"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetEvent } from "@/features/events/api/use-get-event";

export default function PublicEventPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useGetEvent(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive text-lg">Error loading event</p>
          <p className="text-muted-foreground">
            Event not found or an error occurred.
          </p>
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  if ("error" in data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive text-lg">Error: {data.error}</p>
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const event = data.event;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/events">
            <Button variant="outline" className="mb-4">
              ← Back to Events
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">{event.EventName}</h1>
          <p className="text-muted-foreground mt-2">
            {event.Description || "No description"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Created:{" "}
            {new Date(event.CreatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prize Pool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.prizePools.map((prize) => (
                <div key={prize.PrizeID} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{prize.PrizeName}</h3>
                    <Badge variant={prize.IsBlank ? "secondary" : "default"}>
                      {prize.IsBlank ? "Blank" : "Prize"}
                    </Badge>
                  </div>
                  {!prize.IsBlank && (
                    <p className="text-lg font-bold text-primary">
                      ${prize.PrizeValue}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Order: {prize.DisplayOrder}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
