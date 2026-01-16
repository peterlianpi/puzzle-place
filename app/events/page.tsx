"use client";

import { useGetEvents } from "@/features/events/api/use-get-events";
import EventList from "@/features/events/components/EventList";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Trophy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function PublicEventsPage() {
  const {
    allEvents,
    totalCount,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage
  } = useGetEvents({
    limit: 20,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // Load more when the sentinel element comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && allEvents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-primary" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-4 w-96 max-w-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border p-6 shadow-sm">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-9 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading events</AlertTitle>
            <AlertDescription className="mt-2">
              {error && typeof error === 'object' && 'message' in error ? (error as Error).message : "Please try again later"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.EventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.Description &&
        event.Description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && event.IsActive) ||
      (statusFilter === "inactive" && !event.IsActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Discover Events
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Join exciting puzzle events and compete for amazing prizes. Explore
            events created by the community.
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              if (value) setStatusFilter(value as "all" | "active" | "inactive");
            }}
          >
            <SelectTrigger className="max-w-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          <EventList
            title="Events"
            events={filteredEvents}
            baseUrl="/events"
            isLoading={isLoading}
          />

          {/* Infinite scroll sentinel */}
          {hasNextPage && (
            <div
              ref={ref}
              className="flex justify-center items-center py-8"
            >
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Loading more events...
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  Scroll down to load more events
                </div>
              )}
            </div>
          )}

          {/* End of results indicator */}
          {!hasNextPage && allEvents.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">
                Showing {filteredEvents.length} of {totalCount} events
              </p>
              {!hasNextPage && totalCount > 20 && (
                <p className="text-xs mt-1">You've reached the end!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
