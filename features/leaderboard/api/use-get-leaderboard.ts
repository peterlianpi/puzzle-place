import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  eventName: string;
  prizeWon: string;
  date: Date;
}

export const useGetLeaderboard = (limit = 1000, offset = 0) => {
  return useQuery({
    queryKey: ["leaderboard", limit, offset],
    queryFn: async () => {
      const response = await client.api.leaderboard.$get({
        query: {
          limit: limit.toString(),
          offset: offset.toString(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await response.json();

      return {
        leaderboard: data.leaderboard.map((entry) => ({
          ...entry,
          date: new Date(entry.date),
        })),
        pagination: data.pagination,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
