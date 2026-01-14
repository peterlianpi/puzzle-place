"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, TrendingUp, Plus, Trophy, DollarSign, Calendar, Eye, Edit3, Clock, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PrizePool {
  PrizeID: string;
  PrizeName: string;
  PrizeValue: string;
  DisplayOrder: number | null;
  IsBlank: boolean;
}

interface Event {
  EventID: string;
  EventName: string;
  Description: string | null;
  CreatedAt: string;
  prizePools: PrizePool[];
}

interface EventListProps {
  title: string;
  events: Event[];
  baseUrl: string; // "/events" or "/my-events"
  showCreateButton?: boolean;
  showEditButtons?: boolean;
  isLoading?: boolean;
  onCreateClick?: () => void;
}

export default function EventList({
  title,
  events,
  baseUrl,
  showCreateButton = false,
  showEditButtons = false,
  isLoading = false,
  onCreateClick
}: EventListProps) {
  const [viewMode, setViewMode] = useState<"list" | "card">("card");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('card');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === "popular") {
      return b.prizePools.length - a.prizePools.length;
    }
    return new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime();
  });

  const renderSkeletonCards = () => (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden bg-gradient-to-br from-card via-card to-muted/20 border-0 shadow-lg">
          <div className="w-full h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-full mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Skeleton className="h-4 w-12 mx-auto mb-1" />
                <Skeleton className="h-6 w-8 mx-auto" />
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Skeleton className="h-4 w-12 mx-auto mb-1" />
                <Skeleton className="h-6 w-8 mx-auto" />
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <Skeleton className="h-4 w-12" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button
            variant={sortBy === "popular" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("popular")}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Popular
          </Button>
          <Button
            variant={sortBy === "recent" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("recent")}
          >
            Recent
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hidden md:inline-flex"
            onClick={() => setViewMode(viewMode === "card" ? "list" : "card")}
          >
            {viewMode === "card" ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>
          {showCreateButton && (
            onCreateClick ? (
              <Button size="sm" onClick={onCreateClick}>
                <Plus />
              </Button>
            ) : (
              <Link href={`${baseUrl}/create-event`}>
                <Button size="sm">
                  <Plus />
                </Button>
              </Link>
            )
          )}
        </div>
      </div>

      {isLoading && sortedEvents.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderSkeletonCards()}
        </div>
      ) : !sortedEvents || sortedEvents.length === 0 ? (
        <p>
          No events found.{" "}
          {showCreateButton && (
            <Link href={`${baseUrl}/create-event`} className="text-primary">
              Create one
            </Link>
          )}
        </p>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedEvents.map((event) => {
            const totalValue = event.prizePools.reduce((sum, prize) => sum + parseFloat(prize.PrizeValue || '0'), 0);
            const topPrize = Math.max(...event.prizePools.map(p => parseFloat(p.PrizeValue || '0')));
            const nonBlankPrizes = event.prizePools.filter(p => !p.IsBlank).length;

            return (
              <Card
                key={event.EventID}
                className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => window.location.href = `${baseUrl}/${event.EventID}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = `${baseUrl}/${event.EventID}`;
                  }
                }}
                aria-label={`View event: ${event.EventName}`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
                      {event.EventName}
                    </CardTitle>
                    <div className="flex-shrink-0">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <Star className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>

                  {event.Description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {event.Description}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Prize Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Trophy className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="text-xs font-medium text-muted-foreground">Prizes</span>
                      </div>
                      <div className="text-lg font-bold text-foreground">{nonBlankPrizes}</div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs font-medium text-muted-foreground">Total</span>
                      </div>
                      <div className="text-lg font-bold text-foreground">${totalValue.toFixed(0)}</div>
                    </div>
                  </div>

                  {/* Top Prize */}
                  {topPrize > 0 && (
                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-amber-100 dark:bg-amber-900/50 rounded">
                          <Star className="h-3 w-3 text-amber-600" />
                        </div>
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Top Prize</span>
                      </div>
                      <span className="font-bold text-amber-700 dark:text-amber-300">${topPrize.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Date and Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.CreatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`${baseUrl}/${event.EventID}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex"
                      >
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                          aria-label={`View ${event.EventName}`}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </Link>

                      {showEditButtons && (
                        <Link
                          href={`${baseUrl}/${event.EventID}/edit`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border hover:bg-secondary/50 shadow-sm"
                            aria-label={`Edit ${event.EventName}`}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-secondary">
                <th className="border border-border p-3 text-left font-semibold">Event Name</th>
                <th className="border border-border p-3 text-left font-semibold">Description</th>
                <th className="border border-border p-3 text-left font-semibold">Prizes</th>
                <th className="border border-border p-3 text-left font-semibold">Created</th>
                <th className="border border-border p-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((event) => (
                <tr key={event.EventID} className="hover:bg-secondary/50 transition-colors">
                  <td className="border border-border p-3 font-semibold truncate max-w-xs">
                    {event.EventName}
                  </td>
                  <td className="border border-border p-3 text-sm text-muted-foreground truncate max-w-xs">
                    {event.Description || "No description"}
                  </td>
                  <td className="border border-border p-3">
                    <Badge variant="secondary">{event.prizePools.length} prizes</Badge>
                  </td>
                  <td className="border border-border p-3 text-xs text-muted-foreground">
                    {new Date(event.CreatedAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                  <td className="border border-border p-3">
                    <div className="flex gap-2">
                      <Link href={`${baseUrl}/${event.EventID}`}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          View
                        </Button>
                      </Link>
                      {showEditButtons && (
                        <Button size="sm" variant="outline" className="border-border hover:bg-secondary/50">
                          Edit
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}