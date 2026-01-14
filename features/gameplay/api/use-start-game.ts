import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";
import { startGameSchema } from "@/shared/types";

export const useStartGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { eventId: string }) => {
      const validated = startGameSchema.parse(data);
      const response = await client.api.gameplay["start-game"].$post({
        json: validated,
      });
      if (!response.ok) {
        throw new Error("Failed to start game");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gameplay"] });
    },
  });
};
