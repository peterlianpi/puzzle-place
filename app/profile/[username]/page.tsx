"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Navbar } from "@/components/Navbar";
import { mockUsers, mockHistory } from "@/lib/mock-data";
import { Trophy, Calendar, Gamepad2, DollarSign, User } from "lucide-react";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const user = mockUsers.find(u => u.username === username);
  const userHistory = mockHistory.filter(h => h.PlayerUserID === user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">User not found</h1>
          </div>
        </div>
      </div>
    );
  }

  const totalWins = userHistory.filter(h => h.WonPrizeValue && h.WonPrizeValue > 0).length;
  const totalValue = userHistory.reduce((sum, h) => sum + (h.WonPrizeValue || 0), 0);
  const gamesPlayed = userHistory.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.image} alt={user.name || user.username} />
                  <AvatarFallback className="text-2xl">
                    {(user.name || user.username || 'U')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since {user.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Games Played</CardTitle>
                <Gamepad2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gamesPlayed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Wins</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalWins}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value Won</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Game History */}
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Game History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No games played yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Prize Won</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userHistory
                        .sort((a, b) => b.PlayedAt.getTime() - a.PlayedAt.getTime())
                        .map((history) => (
                          <TableRow key={history.HistoryID}>
                            <TableCell className="font-medium">
                              {history.event?.EventName || 'Unknown Event'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={history.WonPrizeValue && history.WonPrizeValue > 0 ? "default" : "secondary"}>
                                {history.WonPrizeName || 'No Prize'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {history.WonPrizeValue ? `$${history.WonPrizeValue.toFixed(2)}` : '-'}
                            </TableCell>
                            <TableCell>
                              {history.PlayedAt.toLocaleDateString('en-US', {
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}