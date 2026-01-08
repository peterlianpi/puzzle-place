import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

type ResponseType = InferResponseType<
  (typeof client.api)["users"]["$get"]
>;

export const useGetUsers = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await client.api["users"]["$get"]();
      return await response.json();
    },
  });
  return query;
};