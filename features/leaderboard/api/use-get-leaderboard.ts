import { useInfiniteQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  eventName: string;
  prizeWon: string;
  date: Date;
}

export const useGetLeaderboard = (limit = 50) => {
  const query = useInfiniteQuery({
    queryKey: ["leaderboard", limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await client.api.leaderboard.$get({
        query: {
          limit: limit.toString(),
          offset: String(pageParam || 0),
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
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      // Check if there are more pages based on the response
      const totalItems = lastPage?.pagination?.total || 0;
      const loadedItems = pages.length * limit;

      if (loadedItems < totalItems) {
        return loadedItems;
      }

      return undefined; // No more pages
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    ...query,
    allLeaderboard: query.data?.pages.flatMap(page => page.leaderboard) || [],
  };
};
