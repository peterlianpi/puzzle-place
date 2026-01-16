import { InferResponseType } from "hono";
import { useInfiniteQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

type ResponseType = InferResponseType<
  (typeof client.api)["events"]["$get"]
>;

// Extract the event type from the response
type EventType = ResponseType extends { events: (infer E)[] } ? E : never;

type UseGetEventsOptions = {
  limit?: number;
  enabled?: boolean;
};

export const useGetEvents = (options: UseGetEventsOptions = {}) => {
  const { limit = 20, enabled = true } = options;

  const query = useInfiniteQuery<ResponseType>({
    queryKey: ["events", limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await client.api["events"]["$get"]({
        query: {
          limit: limit.toString(),
          offset: String(pageParam || 0),
        },
      });
      return await response.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      // Check if there are more pages based on the response
      const totalItems = lastPage?.pagination?.total || 0;
      const loadedItems = pages.length * limit;

      if (loadedItems < totalItems) {
        return loadedItems;
      }

      return undefined; // No more pages
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    ...query,
    // Flatten all pages into a single array for easier consumption
    allEvents: query.data?.pages.flatMap(page =>
      page && 'events' in page ? page.events : []
    ) as EventType[] || [],
    // Get total count from the first page
    totalCount: query.data?.pages[0]?.pagination?.total || 0,
  };
};