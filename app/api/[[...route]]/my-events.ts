import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const createGameEventSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  prizes: z
    .array(
      z.object({
        name: z.string().min(1, "Prize name is required"),
        value: z.number().min(0, "Value must be non-negative"),
        isBlank: z.boolean().default(false),
      })
    )
    .min(5, "At least 5 prizes required")
    .refine(
      (prizes) => prizes.some((p) => !p.isBlank),
      "At least one non-blank prize required"
    ),
});

const updateGameEventSchema = z
  .object({
    eventName: z.string().min(1).optional(),
    description: z.string().optional(),
    prizes: z
      .array(
        z.object({
          name: z.string().min(1, "Prize name is required"),
          value: z.number().min(0, "Value must be non-negative"),
          isBlank: z.boolean().default(false),
        })
      )
      .min(5, "At least 5 prizes required")
      .refine(
        (prizes) => prizes.some((p) => !p.isBlank),
        "At least one non-blank prize required"
      )
      .optional(),
  })
  .partial();

type CreateGameEventRequest = z.infer<typeof createGameEventSchema>;
type UpdateGameEventRequest = z.infer<typeof updateGameEventSchema>;

const app = new Hono()

  .post("/", zValidator("json", createGameEventSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const data: CreateGameEventRequest = c.req.valid("json");
    const { eventName, description, prizes } = data;

    const validPrizes = prizes.map((p) => ({
      name: p.name,
      value: p.value,
      isBlank: p.isBlank,
    }));

    // Sort prizes high to low value
    validPrizes.sort((a, b) => b.value - a.value);

    // Create event
    const event = await prisma.gameEvent.create({
      data: {
        CreatorUserID: userId,
        EventName: eventName,
        Description: description,
        IsActive: true,
      },
    });

    // Create prize pools
    await prisma.eventPrizePool.createMany({
      data: validPrizes.map((p, index) => ({
        EventID: event.EventID,
        PrizeName: p.name,
        PrizeValue: p.value,
        DisplayOrder: index + 1,
        IsBlank: p.isBlank,
      })),
    });

    return c.json({ eventId: event.EventID }, 201);
  })
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
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const userId = session.user.id;
      const { limit: limitStr, offset: offsetStr } = c.req.valid("query");
      const limit = parseInt(limitStr);
      const offset = parseInt(offsetStr);

    const events = await prisma.gameEvent.findMany({
      where: { IsActive: true, CreatorUserID: userId },
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
      where: { IsActive: true, CreatorUserID: userId },
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
  })
  .get(
    "/:id",

    zValidator(
      "param",
      z.object({
        id: z.number(), // ID parameter validation
      })
    ),

    async (c) => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const userId = session.user.id;
      const { id } = c.req.valid("param"); // Extract account ID from URL params

      if (isNaN(id)) {
        return c.json({ error: "Invalid ID" }, 400);
      }

      const event = await prisma.gameEvent.findFirst({
        where: { EventID: id, IsActive: true, CreatorUserID: userId },
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

      return c.json(
        { event: safeEvent },
        {
          headers: {
            "Cache-Control": "public, max-age=600", // Cache for 10 minutes
          },
        }
      );
    }
  )
  .patch("/:id", zValidator("json", updateGameEventSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid ID" }, 400);
    }

    const data: UpdateGameEventRequest = c.req.valid("json");
    const event = await prisma.gameEvent.findFirst({
      where: { EventID: id, CreatorUserID: userId },
    });
    if (!event) {
      return c.json({ error: "Event not found" }, 404);
    }

    // Update event details
    await prisma.gameEvent.update({
      where: { EventID: id },
      data: {
        ...(data.eventName && { EventName: data.eventName }),
        ...(data.description !== undefined && {
          Description: data.description,
        }),
      },
    });

    // If prizes are provided, update them
    if (data.prizes) {
      const validPrizes = data.prizes.map((p) => ({
        name: p.name,
        value: p.value,
        isBlank: p.isBlank,
      }));

      // Sort prizes high to low value
      validPrizes.sort((a, b) => b.value - a.value);

      // Delete existing prize pools
      await prisma.eventPrizePool.deleteMany({
        where: { EventID: id },
      });

      // Create new prize pools
      await prisma.eventPrizePool.createMany({
        data: validPrizes.map((p, index) => ({
          EventID: id,
          PrizeName: p.name,
          PrizeValue: p.value,
          DisplayOrder: index + 1,
          IsBlank: p.isBlank,
        })),
      });
    }
    return c.json({ message: "Event updated" });
  })
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.number(), // ID parameter validation
      })
    ),
    async (c) => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const userId = session.user.id;
      const { id } = c.req.valid("param"); // Extract account ID from URL params

      if (isNaN(id)) {
        return c.json({ error: "Invalid ID" }, 400);
      }

      const event = await prisma.gameEvent.findFirst({
        where: { EventID: id, CreatorUserID: userId },
      });
      if (!event) {
        return c.json({ error: "Event not found" }, 404);
      }

      await prisma.gameEvent.delete({
        where: { EventID: id },
      });
      return c.json({ message: "Event deleted" });
    }
  );

export default app;
