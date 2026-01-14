import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Gamepad2, Users, Calendar, TrendingUp, Award } from "lucide-react";

interface ProfileStatsProps {
  user?: {
    createdAt: Date;
    emailVerified?: boolean | null;
  };
  isCurrentUser?: boolean;
  stats?: {
    eventsCreated: number;
    eventsJoined: number;
    puzzlesSolved: number;
    achievements: number;
  };
  isLoading?: boolean;
}

export function ProfileStats({
  user,
  isCurrentUser = false,
  stats = { eventsCreated: 0, eventsJoined: 0, puzzlesSolved: 0, achievements: 0 },
  isLoading = false
}: ProfileStatsProps) {
  const memberSince = useMemo(() => user ? new Date(user.createdAt) : null, [user]);
  const daysSinceJoin = useMemo(() => {
    if (!memberSince) return 0;
    return Math.floor((new Date().getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24));
  }, [memberSince]);

  const statItems = useMemo(() => [
    {
      icon: Gamepad2,
      label: "Events Created",
      value: stats.eventsCreated.toString(),
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: Users,
      label: "Events Joined",
      value: stats.eventsJoined.toString(),
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      icon: Trophy,
      label: "Puzzles Solved",
      value: stats.puzzlesSolved.toString(),
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      icon: Award,
      label: "Achievements",
      value: stats.achievements.toString(),
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
  ], [stats]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statItems.map((stat, index) => (
              <div
                key={stat.label}
                className={`${stat.bgColor} rounded-lg p-4 transition-all duration-300 hover:scale-105 hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">
                    #{index + 1}
                  </span>
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      {user && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-green-600" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="font-medium">Member Since</span>
                <span className="text-muted-foreground">
                  {memberSince?.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="font-medium">Account Status</span>
                <span className={`flex items-center gap-1 font-medium ${
                  user.emailVerified
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                  {user.emailVerified ? "Verified" : "Pending Verification"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Days Active</span>
                <span className="text-muted-foreground font-medium">
                  {daysSinceJoin}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Placeholder */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-purple-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No recent activity yet</p>
                <p className="text-xs mt-1">Start participating in events to see your activity here!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}