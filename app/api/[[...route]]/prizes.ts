import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const createPrizeSchema = z.object({
  eventId: z.number().int().positive("Event ID must be positive integer"),
  name: z.string().min(1, "Prize name is required"),
  value: z.number().min(0, "Value must be non-negative"),
  isBlank: z.boolean().default(false),
});

const updatePrizeSchema = z.object({
  name: z.string().min(1).optional(),
  value: z.number().min(0).optional(),
  isBlank: z.boolean().optional(),
}).partial();

type CreatePrizeRequest = z.infer<typeof createPrizeSchema>;
type UpdatePrizeRequest = z.infer<typeof updatePrizeSchema>;

const app = new Hono()

  .post("/", zValidator("json", createPrizeSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const data: CreatePrizeRequest = c.req.valid("json");

    // Check if event exists and belongs to user
    const event = await prisma.gameEvent.findFirst({
      where: { EventID: data.eventId, CreatorUserID: userId },
    });
    if (!event) {
      return c.json({ error: "Event not found or not owned by user" }, 404);
    }

    const prize = await prisma.eventPrizePool.create({
      data: {
        EventID: data.eventId,
        PrizeName: data.name,
        PrizeValue: data.value,
        IsBlank: data.isBlank,
      },
    });

    return c.json({ prizeId: prize.PrizeID }, 201);
  })
  .get("/", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const eventId = c.req.query("eventId");
    if (!eventId) {
      return c.json({ error: "eventId query parameter required" }, 400);
    }
    const id = parseInt(eventId);
    if (isNaN(id)) {
      return c.json({ error: "Invalid eventId" }, 400);
    }

    // Check if event belongs to user
    const event = await prisma.gameEvent.findFirst({
      where: { EventID: id, CreatorUserID: userId },
    });
    if (!event) {
      return c.json({ error: "Event not found or not owned by user" }, 404);
    }

    const prizes = await prisma.eventPrizePool.findMany({
      where: { EventID: id },
      orderBy: { DisplayOrder: "asc" },
    });
    return c.json(prizes);
  })
  .get("/:id", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid ID" }, 400);
    }

    const prize = await prisma.eventPrizePool.findFirst({
      where: { PrizeID: id },
      include: { Event: true },
    });
    if (!prize || prize.Event.CreatorUserID !== userId) {
      return c.json({ error: "Prize not found or not owned by user" }, 404);
    }
    return c.json(prize);
  })
  .patch("/:id", zValidator("json", updatePrizeSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid ID" }, 400);
    }

    const data: UpdatePrizeRequest = c.req.valid("json");

    // Check ownership
    const existingPrize = await prisma.eventPrizePool.findFirst({
      where: { PrizeID: id },
      include: { Event: true },
    });
    if (!existingPrize || existingPrize.Event.CreatorUserID !== userId) {
      return c.json({ error: "Prize not found or not owned by user" }, 404);
    }

    await prisma.eventPrizePool.update({
      where: { PrizeID: id },
      data: {
        ...(data.name && { PrizeName: data.name }),
        ...(data.value !== undefined && { PrizeValue: data.value }),
        ...(data.isBlank !== undefined && { IsBlank: data.isBlank }),
      },
    });
    return c.json({ message: "Prize updated" });
  })
  .delete("/:id", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid ID" }, 400);
    }

    // Check ownership
    const existingPrize = await prisma.eventPrizePool.findFirst({
      where: { PrizeID: id },
      include: { Event: true },
    });
    if (!existingPrize || existingPrize.Event.CreatorUserID !== userId) {
      return c.json({ error: "Prize not found or not owned by user" }, 404);
    }

    await prisma.eventPrizePool.delete({
      where: { PrizeID: id },
    });
    return c.json({ message: "Prize deleted" });
  });

export default app;