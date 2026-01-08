import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

type ResponseType = InferResponseType<
  (typeof client.api)["my-events"][":id"]["$get"]
>;

export const useGetGameEvent = (id: string) => {
  const query = useQuery<ResponseType>({
    queryKey: ["my-events", id],
    queryFn: async () => {
      const response = await client.api["my-events"][":id"]["$get"]({
        param: { id },
      });
      return await response.json();
    },
    enabled: !!id,
  });
  return query;
};