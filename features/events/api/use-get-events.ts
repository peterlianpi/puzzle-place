import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

type ResponseType = InferResponseType<
  (typeof client.api)["events"]["$get"]
>;

export const useGetEvents = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await client.api["events"]["$get"]();
      return await response.json();
    },
  });
  return query;
};