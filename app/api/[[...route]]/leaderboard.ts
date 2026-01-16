import { prisma } from "@/lib/db/prisma";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { handleApiError } from "@/lib/api-errors";

const leaderboardQuerySchema = z.object({
  limit: z.string().optional().default("1000"),
  offset: z.string().optional().default("0"),
  eventId: z.string().optional(),
});

const app = new Hono()

  .get("/", zValidator("query", leaderboardQuerySchema), async (c) => {
    const {
      limit: limitStr,
      offset: offsetStr,
      eventId,
    } = c.req.valid("query");
    const limit = parseInt(limitStr);
    const offset = parseInt(offsetStr);

    const leaderboard = await prisma.gameHistory.findMany({
      where: {
        WonPrizeValue: {
          not: null,
          gt: 0,
        },
        ...(eventId && { EventID: eventId }),
      },
      include: {
        playerUser: {
          select: {
            username: true,
            name: true,
          },
        },
        Event: {
          select: {
            EventName: true,
          },
        },
      },
      orderBy: {
        WonPrizeValue: "desc",
      },
      take: limit,
      skip: offset,
    });

    // Format the data
    const formattedLeaderboard = leaderboard.map((entry, index) => ({
      rank: offset + index + 1,
      playerName:
        entry.playerUser?.name || entry.playerUser?.username || "Anonymous",
      eventName: entry.Event.EventName,
      prizeWon: entry.WonPrizeValue?.toString() || "0",
      date: entry.PlayedAt,
    }));

    const total = await prisma.gameHistory.count({
      where: {
        WonPrizeValue: {
          not: null,
          gt: 0,
        },
        ...(eventId && { EventID: eventId }),
      },
    });

    return c.json(
      {
        leaderboard: formattedLeaderboard,
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
  .onError((error, c) => handleApiError(c, error));

export default app;
