import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";
import { finishGameSchema } from "@/shared/types";

export const useFinishGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { gameId: string; finalCase: number }) => {
      const validated = finishGameSchema.parse(data);
      const response = await client.api.gameplay["finish-game"].$post({
        json: validated,
      });
      if (!response.ok) {
        throw new Error("Failed to finish game");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gameplay"] });
    },
  });
};
