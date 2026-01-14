import { prisma } from "@/lib/db/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { handleApiError } from "@/lib/api-errors";
import { Logger } from "@/lib/logger";

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
  )

  // Get User by Username Endpoint
  .get("/:username", async (c) => {
    try {
      const username = c.req.param("username");

      if (!username) {
        return c.json({ error: "Username is required" }, 400);
      }

      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          createdAt: true,
          image: true,
        },
      });

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json({ user });
    } catch (error) {
      await Logger.error("Get user by username error", { details: String(error) });
      return c.json({ error: "Internal server error" }, 500);
    }
  })

  .onError((error, c) => handleApiError(c, error));

export default app;
