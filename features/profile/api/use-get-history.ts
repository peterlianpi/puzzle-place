import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

export const useGetHistory = () => {
  return useQuery({
    queryKey: ["history", "me"],
    queryFn: async () => {
      const response = await client.api.profile["export"].$get();
      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }
      const data = await response.json();
      return { history: data.user?.gameHistories || [] };
    },
  });
};