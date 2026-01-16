"use client";

import { lazy, Suspense } from "react";
import { redirect } from "next/navigation";
import { useParams } from "next/navigation";
import { useAuthStatus } from "@/features/auth/api/use-auth-status";
import { useGetEvent } from "@/features/events/api/use-get-event";
import { Navbar } from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

const CreateEventForm = lazy(
  () => import("@/features/my-events/components/CreateEventForm")
);

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const { isAuthenticated, user, isLoading: authLoading } = useAuthStatus();
  const { data, isLoading: eventLoading, error } = useGetEvent(eventId);

  if (authLoading || eventLoading) {
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
    redirect("/auth/login?next=/events/" + eventId + "/edit");
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error loading event</AlertTitle>
              <AlertDescription>
                Event not found or an error occurred.
              </AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Link href="/events">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if ("error" in data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error: {data.error}</AlertTitle>
              <AlertDescription>
                An error occurred while loading the event.
              </AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Link href="/events">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // API now returns event directly
  const event = data && !('error' in data) ? data : null;

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Event not found</AlertTitle>
              <AlertDescription>
                The requested event could not be found.
              </AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Link href="/events">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.id !== event.CreatorUserID) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                You do not have permission to edit this event.
              </AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Link href={`/events/${eventId}`}>
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formEvent = {
    eventId: event.EventID || eventId,
    eventName: event.EventName,
    description: event.Description,
    prizes: event.prizePools.map(p => ({
      name: p.PrizeName,
      value: Number(p.PrizeValue),
      isBlank: p.IsBlank,
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Edit Event
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Update your prize event details and prizes
            </p>
          </div>
          <Suspense
            fallback={
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }
          >
            <CreateEventForm mode="update" event={formEvent} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}