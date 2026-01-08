import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { Hono } from "hono";

const app = new Hono()

  .get("/", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const limit = parseInt(c.req.query("limit") || "20");
    const offset = parseInt(c.req.query("offset") || "0");

    const events = await prisma.gameEvent.findMany({
      where: { IsActive: true },
      include: {
        prizePools: {
          select: {
            PrizeID: true,
            PrizeName: true,
            PrizeValue: true,
            DisplayOrder: true,
            IsBlank: true,
          },
        },
      },
      orderBy: { CreatedAt: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.gameEvent.count({
      where: { IsActive: true },
    });

    return c.json(
      {
        events,
        pagination: {
          limit,
          offset,
          total,
          hasMore: offset + limit < total,
        },
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300", // Cache for 5 minutes
        },
      }
    );
  })
  .get("/:id", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid ID" }, 400);
    }

    const event = await prisma.gameEvent.findFirst({
      where: { EventID: id, IsActive: true },
      include: {
        prizePools: {
          select: {
            PrizeID: true,
            PrizeName: true,
            PrizeValue: true,
            DisplayOrder: true,
            IsBlank: true,
          },
        },
      },
    });
    if (!event) {
      return c.json({ error: "Event not found" }, 404);
    }
    return c.json(
      { event },
      {
        headers: {
          "Cache-Control": "public, max-age=600", // Cache for 10 minutes
        },
      }
    );
  });

export default app;