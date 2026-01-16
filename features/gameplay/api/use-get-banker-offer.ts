import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

export const useGetBankerOffer = (gameId: string) => {
  return useQuery({
    queryKey: ["banker-offer", gameId],
    queryFn: async () => {
      const response = await client.api.gameplay["banker-offer"][":gameId"].$get({
        param: { gameId },
      });
      if (!response.ok) {
        throw new Error("Failed to get banker offer");
      }
      return response.json();
    },
    enabled: !!gameId,
  });
};