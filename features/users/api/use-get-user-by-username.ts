import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";

type UseGetUserByUsernameOptions = {
  username: string;
  enabled?: boolean;
};

type User = {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  emailVerified?: boolean | null;
  image?: string | null;
  createdAt: Date;
};

type SuccessResponse = { user: User };
type ErrorResponse = { error: string };

export const useGetUserByUsername = ({
  username,
  enabled = true,
}: UseGetUserByUsernameOptions) => {
  const query = useQuery<SuccessResponse>({
    queryKey: ["user", username],
    queryFn: async () => {
      const response = await client.api["users"][":username"]["$get"]({
        param: { username },
      });
      const data = (await response.json()) as
        | {
            user: {
              id: string;
              name: string | null;
              email: string;
              username: string | null;
              emailVerified?: boolean | null;
              createdAt: string;
              image: string | null;
            };
          }
        | { error: string };

      if ("error" in data) {
        throw new Error((data as ErrorResponse).error);
      }
      return {
        user: { ...data.user, createdAt: new Date(data.user.createdAt) },
      };
    },
    enabled: enabled && !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes - user profiles don't change often
  });
  return query;
};
