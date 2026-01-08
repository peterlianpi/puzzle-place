import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

type ResponseType = InferResponseType<
  (typeof client.api)["events"]["$get"]
>;

type UseGetEventsOptions = {
  limit?: number;
  offset?: number;
};

export const useGetEvents = (options: UseGetEventsOptions = {}) => {
  const { limit = 20, offset = 0 } = options;

  const query = useQuery<ResponseType>({
    queryKey: ["events", limit, offset],
    queryFn: async () => {
      const response = await client.api["events"]["$get"]({
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