"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useGetEvent } from "@/features/events/api/use-get-event";
import { useAuthStatus } from "@/features/auth/api/use-auth-status";
import LoginPromptBanner from "@/features/auth/components/login-prompt-banner";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { ArrowLeft, Trophy, Calendar, Users, Play, AlertCircle, Sparkles } from "lucide-react";

export default function PublicEventPage() {
  const params = useParams();
  const id = params.id as string;
  const {
    data: session,
    isPending,
  } = authClient.useSession();
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const isAuthenticated = !!session?.user;
  const { data, isLoading, error, refetch } = useGetEvent(id);

  const handleJoinEvent = () => {
    if (!isAuthenticated) {
      setShowLoginOverlay(true);
    } else {
      // TODO: Implement join event logic
      alert("Joining event... (not implemented yet)");
    }
  };

  if (isLoading || isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Skeleton className="h-10 w-32 mb-4" />
              <Skeleton className="h-12 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-12 w-32 mb-6" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error loading event</AlertTitle>
              <AlertDescription className="mt-2">
                Event not found or an error occurred.
                <button
                  onClick={() => refetch()}
                  className="ml-2 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                  aria-label="Retry loading event"
                >
                  Retry
                </button>
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
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error: {data.error}</AlertTitle>
              <AlertDescription>
                An error occurred while loading events. Please try refreshing the page.
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

  const event = data.event;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/events">
              <Button variant="outline" className="mb-6 group" aria-label="Back to events">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Events
              </Button>
            </Link>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-2">{event.EventName}</h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {event.Description || "No description available"}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Created {new Date(event.CreatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event.prizePools.length} prizes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="mb-6">
              <LoginPromptBanner
                message="Sign up to join events and win prizes!"
                redirect={window.location.pathname}
              />
            </div>
          )}

          <div className="mb-8">
            <Button
              onClick={handleJoinEvent}
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all duration-200"
              aria-label="Join this event"
            >
              <Play className="h-5 w-5 mr-2" />
              Join Event
            </Button>
          </div>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-amber-500" />
                Prize Pool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.prizePools
                  .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0))
                  .map((prize, index) => (
                  <div
                    key={prize.PrizeID}
                    className="border rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-card to-muted/20"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {index + 1}
                        </span>
                        <h3 className="font-semibold text-foreground">{prize.PrizeName}</h3>
                      </div>
                      <Badge
                        variant={prize.IsBlank ? "secondary" : "default"}
                        className="ml-2"
                      >
                        {prize.IsBlank ? "Blank" : "Prize"}
                      </Badge>
                    </div>
                    {!prize.IsBlank && (
                      <p className="text-2xl font-bold text-primary mb-2">
                        ${parseFloat(prize.PrizeValue || '0').toFixed(2)}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Display Order: {prize.DisplayOrder || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
              {event.prizePools.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No prizes configured for this event yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {showLoginOverlay && (
            <LoginPromptBanner
              title="Join Event"
              message="You need to be logged in to join this event and participate."
              action="Login to Join"
              redirect={window.location.pathname}
            />
          )}
        </div>
      </div>
    </div>
  );
}
