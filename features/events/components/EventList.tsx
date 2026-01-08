"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, TrendingUp, Plus } from "lucide-react";

interface PrizePool {
  PrizeID: number;
  PrizeName: string;
  PrizeValue: string;
  DisplayOrder: number | null;
  IsBlank: boolean;
}

interface Event {
  EventID: number;
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
}

export default function EventList({
  title,
  events,
  baseUrl,
  showCreateButton = false,
  showEditButtons = false
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
            <Link href={`${baseUrl}/create-event`}>
              <Button size="sm">
                <Plus />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {!sortedEvents || sortedEvents.length === 0 ? (
        <p>
          No events found.{" "}
          {showCreateButton && (
            <Link href={`${baseUrl}/create-event`} className="text-blue-500">
              Create one
            </Link>
          )}
        </p>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedEvents.map((event) => (
            <Card key={event.EventID} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="truncate">{event.EventName}</CardTitle>
              </CardHeader>
              <CardContent className="leading-relaxed">
                <p className="text-sm text-gray-600 mb-2 truncate">
                  {event.Description || "No description"}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="secondary">
                    {event.prizePools.length} prizes
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(event.CreatedAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link href={`${baseUrl}/${event.EventID}`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      View
                    </Button>
                  </Link>
                  {showEditButtons && (
                    <Link href={`${baseUrl}/${event.EventID}/edit`}>
                      <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                        Edit
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left font-semibold">Event Name</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Description</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Prizes</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Created</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((event) => (
                <tr key={event.EventID} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 p-3 font-semibold truncate max-w-xs">
                    {event.EventName}
                  </td>
                  <td className="border border-gray-300 p-3 text-sm text-gray-600 truncate max-w-xs">
                    {event.Description || "No description"}
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Badge variant="secondary">{event.prizePools.length} prizes</Badge>
                  </td>
                  <td className="border border-gray-300 p-3 text-xs text-gray-500">
                    {new Date(event.CreatedAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                  <td className="border border-gray-300 p-3">
                    <div className="flex gap-2">
                      <Link href={`${baseUrl}/${event.EventID}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          View
                        </Button>
                      </Link>
                      {showEditButtons && (
                        <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
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