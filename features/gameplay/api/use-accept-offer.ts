import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";
import { acceptOfferSchema } from "@/shared/types";

export const useAcceptOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { gameId: string; offerAmount: number }) => {
      const validated = acceptOfferSchema.parse(data);
      const response = await client.api.gameplay["accept-offer"].$post({
        json: validated,
      });
      if (!response.ok) {
        throw new Error("Failed to accept offer");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gameplay"] });
    },
  });
};
