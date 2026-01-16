"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useGetLeaderboard } from "@/features/leaderboard/api/use-get-leaderboard";

const ITEMS_PER_LOAD = 50;

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<"date" | "prize">("prize");

  const {
    allLeaderboard,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage
  } = useGetLeaderboard(ITEMS_PER_LOAD);

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

  const sortedLeaderboard = [...allLeaderboard]
    .filter(entry => entry.prizeWon !== '$0' && entry.prizeWon !== 'Blank')
    .sort((a, b) => {
      if (sortBy === "prize") {
        const aValue = parseFloat(a.prizeWon.replace(/[^0-9.]/g, '')) || 0;
        const bValue = parseFloat(b.prizeWon.replace(/[^0-9.]/g, '')) || 0;
        return bValue - aValue;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-muted rounded mb-8"></div>
            <div className="h-96 bg-muted rounded"></div>
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
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Leaderboard</h1>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Top winners across all events. See who&apos;s claiming the biggest prizes!
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Top Winners</CardTitle>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "prize")}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prize">Sort by Prize Value</SelectItem>
                  <SelectItem value="date">Sort by Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {sortedLeaderboard.map((entry) => (
                <Card key={entry.rank} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.rank)}
                        <span className={`text-lg font-bold ${entry.rank <= 3 ? "text-primary" : "text-muted-foreground"}`}>
                          #{entry.rank}
                        </span>
                      </div>
                      <Badge variant="secondary" className="font-bold">
                        {entry.prizeWon}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{entry.playerName}</p>
                      <p className="text-sm text-muted-foreground">{entry.eventName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Prize Won</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLeaderboard.map((entry) => (
                    <TableRow key={entry.rank}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getRankIcon(entry.rank)}
                          <span className={entry.rank <= 3 ? "font-bold text-primary" : ""}>
                            #{entry.rank}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{entry.playerName}</TableCell>
                      <TableCell>{entry.eventName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold">
                          {entry.prizeWon}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Infinite scroll indicators */}
            {hasNextPage && (
              <div
                ref={ref}
                className="flex justify-center items-center py-8 mt-6"
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Loading more winners...
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Scroll down to load more winners
                  </div>
                )}
              </div>
            )}

            {!hasNextPage && sortedLeaderboard.length > 0 && (
              <div className="text-center py-8 mt-6 text-muted-foreground">
                <p className="text-sm">
                  Showing {sortedLeaderboard.length} winners
                </p>
                {!hasNextPage && sortedLeaderboard.length >= 50 && (
                  <p className="text-xs mt-1">You've reached the end!</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
