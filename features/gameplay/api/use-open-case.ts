import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";
import { openCaseSchema } from "@/shared/types";

export const useOpenCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { gameId: string; caseNumber: number }) => {
      const validated = openCaseSchema.parse(data);
      const response = await client.api.gameplay["open-case"].$post({
        json: validated,
      });
      if (!response.ok) {
        throw new Error("Failed to open case");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gameplay"] });
    },
  });
};
