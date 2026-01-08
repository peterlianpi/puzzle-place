"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Calendar, User, Trophy } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useGetEvent } from "@/features/events/api/use-get-event";
import { useDeleteGameEvent } from "@/features/my-events/api/use-delete-game-event";

interface GameEvent {
  EventID: number;
  EventName: string;
  Description: string | null;
  IsActive: boolean;
  CreatedAt: string;
  CreatorUserID: string;
  prizePools: {
    PrizeID: number;
    PrizeName: string;
    PrizeValue: string;
    DisplayOrder: number | null;
    IsBlank: boolean;
  }[];
}

export default function GameEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { data, isLoading } = useGetEvent(eventId);
  const deleteMutation = useDeleteGameEvent();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (data && !("error" in data)) {
      const checkOwnership = async () => {
        const session = await authClient.getSession();
        if (session?.data?.user?.id === data.event.CreatorUserID) {
          setIsOwner(true);
        }
      };
      checkOwnership();
    }
  }, [data]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteMutation.mutateAsync({ id: eventId });
        toast.success("Event deleted successfully");
        router.push("/my-events");
      } catch (error) {
        toast.error("Failed to delete event");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || "error" in data) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="text-gray-600 mb-4">
              The event you&apos;re looking for doesn&apos;t exist or has been
              deleted.
            </p>
            <Link href="/my-events">
              <Button>Back to My Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const event: GameEvent = data.event;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/my-events">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{event.EventName}</h1>
        {event.Description && (
          <p className="text-gray-600 mt-2">{event.Description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Prize Pool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {event.prizePools
                  .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0))
                  .map((prize, index) => (
                    <div
                      key={prize.PrizeID}
                      className={`flex justify-between items-center p-3 rounded-lg border ${
                        prize.IsBlank
                          ? "bg-gray-50 border-gray-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="font-medium mr-3">#{index + 1}</span>
                        <span className={prize.IsBlank ? "text-gray-500" : ""}>
                          {prize.PrizeName}
                        </span>
                        {prize.IsBlank && (
                          <Badge variant="secondary" className="ml-2">
                            Blank
                          </Badge>
                        )}
                      </div>
                      <span className="font-bold text-lg">
                        ${parseFloat(prize.PrizeValue).toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                Created by: You
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Created: {new Date(event.CreatedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm">
                <Trophy className="h-4 w-4 mr-2" />
                Total Prizes: {event.prizePools.length}
              </div>
              <div className="text-sm">
                Total Value: $
                {event.prizePools.reduce(
                  (sum, prize) => sum + parseFloat(prize.PrizeValue),
                  0
                ).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {isOwner && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/my-events/${eventId}/edit`}>
                  <Button className="w-full" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Event
                  </Button>
                </Link>
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleteMutation.isPending ? "Deleting..." : "Delete Event"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
