import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

type ResponseType = InferResponseType<(typeof client.api)["users"]["$get"]>;

type UseGetUsersOptions = {
  limit?: number;
  offset?: number;
  enabled?: boolean;
};

export const useGetUsers = (options: UseGetUsersOptions = {}) => {
  const { limit = 10, offset = 0, enabled = true } = options;
  const query = useQuery<ResponseType>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await client.api["users"]["$get"]({
        query: {
          limit: limit.toString(),
          offset: offset.toString(),
        },
      });
      return await response.json();
    },
    enabled,
  });
  return query;
};
