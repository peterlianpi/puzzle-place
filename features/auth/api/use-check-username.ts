import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

type ResponseType = { available: boolean };

type UseCheckUsernameOptions = {
  username: string;
  enabled?: boolean;
};

export const useCheckUsername = (options: UseCheckUsernameOptions) => {
  const { username, enabled = false } = options;

  const query = useQuery<ResponseType>({
    queryKey: ["check-username", username],
    queryFn: async () => {
      const response = await client.api["auth-user"]["check-username"]["$post"]({
        json: { username },
      });
      const json = await response.json();
      if ("error" in json) {
        throw new Error(json.error);
      }
      return json as ResponseType;
    },
    enabled: enabled && username.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return query;
};
