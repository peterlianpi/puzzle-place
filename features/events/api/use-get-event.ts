import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

type ResponseType = InferResponseType<
  (typeof client.api)["events"][":id"]["$get"]
>;

export const useGetEvent = (id: string) => {
  const query = useQuery<ResponseType>({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await client.api["events"][":id"]["$get"]({
        param: { id },
      });
      return await response.json();
    },
    enabled: !!id,
  });
  return query;
};
