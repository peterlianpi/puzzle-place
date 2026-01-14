import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

export const useAuthStatus = () => {
  const query = useQuery({
    queryKey: ["auth-status"],
    queryFn: async () => {
      try {
        const response = await client.api["auth-user"]["get-user"]["$get"]();
        const data = await response.json();
        if ("error" in data) {
          return { isAuthenticated: false, user: null };
        }
        return { isAuthenticated: true, user: data.user };
      } catch {
        return { isAuthenticated: false, user: null };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  return {
    isAuthenticated: query.data?.isAuthenticated ?? false,
    user: query.data?.user ?? null,
    isLoading: query.isLoading,
  };
};