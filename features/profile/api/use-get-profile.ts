import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await client.api.profile.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      return data;
    },
  });
};
