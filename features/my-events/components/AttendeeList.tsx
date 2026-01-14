"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { useGetAttendees } from "../api/use-get-attendees";

interface AttendeeListProps {
  eventId: string;
}

interface Attendee {
  userId: string;
  username: string;
  name: string;
  avatar?: string;
  joinedAt: string;
}

export const AttendeeList: React.FC<AttendeeListProps> = React.memo(({ eventId }) => {
  const { data, isLoading, error } = useGetAttendees(eventId);

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <Users className="h-5 w-5" />
            Attendees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load attendees.</p>
        </CardContent>
      </Card>
    );
  }

  const attendees: Attendee[] = data?.attendees || [];

  return (
    <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Attendees ({attendees.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {attendees.length === 0 ? (
          <p className="text-muted-foreground">No attendees yet.</p>
        ) : (
          <div className="space-y-3">
            {attendees.map((attendee) => (
              <div key={attendee.userId} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={attendee.avatar} alt={`${attendee.name} avatar`} />
                  <AvatarFallback>
                    {attendee.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{attendee.name}</p>
                  <p className="text-xs text-muted-foreground truncate">@{attendee.username}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Joined {new Date(attendee.joinedAt).toLocaleDateString()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

AttendeeList.displayName = "AttendeeList";