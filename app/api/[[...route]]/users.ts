import { prisma } from "@/lib/db/prisma";
import { Hono } from "hono";


const app = new Hono()

  // Get Users Endpoint
  .get(
    "/",

    async (c) => {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          image: true,
        },
      });

      return c.json(users);
    }
  );

export default app;
