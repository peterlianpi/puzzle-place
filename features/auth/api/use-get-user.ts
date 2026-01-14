import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

type User = {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  emailVerified: boolean | null;
  image?: string | null;
  createdAt: Date;
};

type SuccessResponse = { user: User };
type ErrorResponse = { error: string };

type UseGetUserOptions = {
  enabled?: boolean;
};

export const useGetUser = (options: UseGetUserOptions = {}) => {
  const { enabled = true } = options;

  const query = useQuery<SuccessResponse>({
    queryKey: ["get-user"],
    queryFn: async () => {
      const response = await client.api["auth-user"]["get-user"]["$get"]();
      const data = await response.json();
      if ("error" in data) {
        throw new Error((data as ErrorResponse).error);
      }
      return { user: { ...data.user, createdAt: new Date(data.user.createdAt) } };
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return query;
};
