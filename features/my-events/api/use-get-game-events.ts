import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

type ResponseType = InferResponseType<
  (typeof client.api)["my-events"]["$get"]
>;

type UseGetGameEventsOptions = {
  limit?: number;
  offset?: number;
};

export const useGetGameEvents = (options: UseGetGameEventsOptions = {}) => {
  const { limit = 20, offset = 0 } = options;

  const query = useQuery<ResponseType>({
    queryKey: ["my-events", limit, offset],
    queryFn: async () => {
      const response = await client.api["my-events"]["$get"]({
        query: {
          limit: limit.toString(),
          offset: offset.toString(),
        },
      });
      return await response.json();
    },
  });
  return query;
};
