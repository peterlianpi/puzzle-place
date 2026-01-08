import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

type ResponseType = InferResponseType<
  (typeof client.api)["my-events"]["$get"]
>;

export const useGetGameEvents = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["my-events"],
    queryFn: async () => {
      const response = await client.api["my-events"]["$get"]();
      return await response.json();
    },
  });
  return query;
};
