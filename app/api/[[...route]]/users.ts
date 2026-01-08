import { prisma } from "@/lib/db/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

const app = new Hono()

  // Get Users Endpoint
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        limit: z.string().optional().default("20"),
        offset: z.string().optional().default("0"),
      })
    ),
    async (c) => {
      const { limit: limitStr, offset: offsetStr } = c.req.valid("query");
      const limit = parseInt(limitStr);
      const offset = parseInt(offsetStr);
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          username: true,
          createdAt: true,
          image: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      });

      return c.json(users);
    }
  );

export default app;
