"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Edit, Trash2, Calendar, User, Trophy, AlertCircle, DollarSign, Settings, Trash, Wifi, WifiOff } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useGetEvent } from "@/features/events/api/use-get-event";
import { useDeleteGameEvent } from "@/features/my-events/api/use-delete-game-event";
import { useWebSocket } from "@/lib/hooks/use-websocket";
const AttendeeList = React.lazy(() => import("@/features/my-events/components/AttendeeList").then(module => ({ default: module.AttendeeList })));
import { ShareButton } from "@/features/my-events/components/ShareButton";

interface GameEvent {
  EventID: string;
  EventName: string;
  Description: string | null;
  IsActive: boolean;
  CreatedAt: string;
  CreatorUserID: string;
  prizePools: {
    PrizeID: string;
    PrizeName: string;
    PrizeValue: string;
    DisplayOrder: number | null;
    IsBlank: boolean;
  }[];
}

const GameEventDetailPage: React.FC = React.memo(() => {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { data, isLoading, refetch } = useGetEvent(eventId);
  const deleteMutation = useDeleteGameEvent();
  const [isOwner, setIsOwner] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // WebSocket for real-time updates
  const { isConnected } = useWebSocket({
    url: `ws://localhost:3000/api/ws/events/${eventId}`, // WebSocket URL
    onMessage: (message: unknown) => {
      if (typeof message === 'object' && message !== null && 'type' in message && message.type === 'event-updated') {
        refetch(); // Refetch event data on update
      }
    },
    onError: () => {
      toast.error("Connection lost. Real-time updates disabled.");
    },
  });

  useEffect(() => {
    if (data && !("error" in data)) {
      const checkOwnership = async () => {
        const session = await authClient.getSession();
        if (session?.data?.user?.id === data.CreatorUserID) {
          setIsOwner(true);
        }
      };
      checkOwnership();
    }
  }, [data]);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: eventId });
      toast.success("Event deleted successfully");
      router.push("/my-events");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Skeleton className="h-10 w-32 mb-4" />
              <Skeleton className="h-12 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-24" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full mb-3" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || "error" in data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Event Not Found</AlertTitle>
              <AlertDescription className="mt-2">
                The event you&apos;re looking for doesn&apos;t exist or has been deleted.
                <Link href="/my-events" className="block mt-2">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to My Events
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  // API now returns event directly
  const event: GameEvent = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link href="/my-events">
              <Button variant="outline" className="mb-6 group" aria-label="Back to my events">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to My Events
              </Button>
            </Link>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">{event.EventName}</h1>
                  <ShareButton eventId={eventId} eventName={event.EventName} />
                  {isConnected ? (
                    <Wifi className="h-5 w-5 text-green-500" aria-label="Real-time updates active" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-500" aria-label="Real-time updates disconnected" />
                  )}
                </div>
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
                    <Trophy className="h-4 w-4" />
                    {event.prizePools.length} prizes
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Total value: ${event.prizePools.reduce(
                      (sum, prize) => sum + parseFloat(prize.PrizeValue || '0'),
                      0
                    ).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Trophy className="h-6 w-6 text-amber-500" />
                    Prize Pool
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.prizePools
                      .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0))
                      .map((prize, index) => (
                        <div
                          key={prize.PrizeID}
                          className={`flex justify-between items-center p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                            prize.IsBlank
                              ? "bg-muted/50 border-muted"
                              : "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                              {index + 1}
                            </span>
                            <div>
                              <span className={`font-medium ${prize.IsBlank ? "text-muted-foreground" : ""}`}>
                                {prize.PrizeName}
                              </span>
                              {prize.IsBlank && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  Blank
                                </Badge>
                              )}
                            </div>
                          </div>
                          <span className={`font-bold text-xl ${prize.IsBlank ? "text-muted-foreground" : "text-primary"}`}>
                            ${parseFloat(prize.PrizeValue || '0').toFixed(2)}
                          </span>
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
            </div>

            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Event Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Created by:</span>
                    <span className="ml-1 font-medium">You</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span className="ml-1">{new Date(event.CreatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Trophy className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Total prizes:</span>
                    <span className="ml-1 font-medium">{event.prizePools.length}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-sm text-muted-foreground mb-1">Total Value</div>
                    <div className="text-2xl font-bold text-primary">
                      ${event.prizePools.reduce(
                        (sum, prize) => sum + parseFloat(prize.PrizeValue || '0'),
                        0
                      ).toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Suspense fallback={<Skeleton className="h-32 w-full" />}>
                <AttendeeList eventId={eventId} />
              </Suspense>

              {isOwner && (
                <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-orange-500" />
                      Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href={`/my-events/${eventId}/edit`}>
                      <Button className="w-full shadow-md hover:shadow-lg transition-all duration-200" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Event
                      </Button>
                    </Link>
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <AlertDialogTrigger>
                        <Button
                          className="w-full shadow-md hover:shadow-lg transition-all duration-200"
                          variant="destructive"
                          disabled={deleteMutation.isPending}
                          aria-describedby="delete-status"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          {deleteMutation.isPending ? "Deleting..." : "Delete Event"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the event &quot;{event.EventName}&quot; and remove all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Event
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <div id="delete-status" className="sr-only">
                      {deleteMutation.isPending ? "Deleting event, please wait" : "Click to delete this event"}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

GameEventDetailPage.displayName = "GameEventDetailPage";

export default GameEventDetailPage;
