import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { handleApiError } from "@/lib/api-errors";

const app = new Hono()

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

      const events = await prisma.gameEvent.findMany({
        where: { IsActive: true },
        include: {
          prizePools: {
            select: {
              PrizeID: true,
              EventID: true,
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

      // Ensure all data is properly formatted
      const safeEvents = events.map((event) => ({
        ...event,
        Description: event.Description || null,
        prizePools: event.prizePools.map((prize) => ({
          ...prize,
          PrizeValue: prize.PrizeValue?.toString() || "0",
          DisplayOrder: prize.DisplayOrder || 0,
        })),
      }));

      const total = await prisma.gameEvent.count({
        where: { IsActive: true },
      });

      return c.json(
        {
          events: safeEvents,
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
    }
  )
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(), // ID parameter validation
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Invalid ID" }, 400);
      }

      const event = await prisma.gameEvent.findFirst({
        where: { EventID: id, IsActive: true },
        include: {
          prizePools: {
            select: {
              PrizeID: true,
              EventID: true,
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

      // Ensure all data is properly formatted
      const safeEvent = {
        ...event,
        Description: event.Description || null,
        prizePools: event.prizePools.map((prize) => ({
          ...prize,
          PrizeValue: prize.PrizeValue?.toString() || "0",
          DisplayOrder: prize.DisplayOrder || 0,
        })),
      };

      return c.json(safeEvent, {
        headers: {
          "Cache-Control": "public, max-age=600", // Cache for 10 minutes
        },
      });
    }
  )
  .onError((error, c) => handleApiError(c, error));

export default app;
