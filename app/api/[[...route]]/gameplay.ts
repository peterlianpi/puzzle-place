import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { handleApiError } from "@/lib/api-errors";
import { startGameSchema, openCaseSchema, acceptOfferSchema, finishGameSchema } from "@/shared/types";

const bankerOfferSchema = z.array(z.object({
  amount: z.number(),
  accepted: z.boolean(),
  atCaseCount: z.number(),
}));

const app = new Hono()

  .post("/start-game", zValidator("json", startGameSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const { eventId } = c.req.valid("json");

    // Validate event exists and is active
    const event = await prisma.gameEvent.findFirst({
      where: { EventID: eventId, IsActive: true },
      include: { prizePools: true },
    });
    if (!event) {
      return c.json({ error: "Event not found" }, 404);
    }

    // Check if user already has an unfinished game for this event
    const existingGame = await prisma.game.findFirst({
      where: { EventID: eventId, PlayerUserID: userId, IsFinished: false },
    });
    if (existingGame) {
      return c.json({ error: "Game already in progress for this event" }, 409);
    }

    // Shuffle cases: assign prizes to case numbers 1-26
    const prizes = event.prizePools;
    const caseNumbers = Array.from({ length: 26 }, (_, i) => i + 1);
    const shuffledPrizes = prizes.sort(() => Math.random() - 0.5);

    // Assign prizes to cases
    const caseAssignments = caseNumbers.map((caseNum, index) => ({
      caseNumber: caseNum,
      prizeId: shuffledPrizes[index % prizes.length].PrizeID,
    }));

    // Create game
    const game = await prisma.game.create({
      data: {
        EventID: eventId,
        PlayerUserID: userId,
        CaseAssignments: caseAssignments,
        OpenedCases: [],
      },
    });

    return c.json({
      gameId: game.GameID,
      caseAssignments: caseAssignments, // Send to client for client-side logic, but server will validate
    }, 201);
  })

  .post("/open-case", zValidator("json", openCaseSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const { gameId, caseNumber } = c.req.valid("json");

    // Get game
    const game = await prisma.game.findFirst({
      where: { GameID: gameId, PlayerUserID: userId, IsFinished: false },
      include: { event: { include: { prizePools: true } } },
    });
    if (!game) {
      return c.json({ error: "Game not found" }, 404);
    }

    // Check if case already opened
    const openedCases = game.OpenedCases as number[] || [];
    if (openedCases.includes(caseNumber)) {
      return c.json({ error: "Case already opened" }, 400);
    }

    // Find prize for this case
    const caseAssignments = game.CaseAssignments as { caseNumber: number; prizeId: string }[];
    const assignment = caseAssignments.find(a => a.caseNumber === caseNumber);
    if (!assignment) {
      return c.json({ error: "Invalid case number" }, 400);
    }

    const prize = game.event.prizePools.find(p => p.PrizeID === assignment.prizeId);
    if (!prize) {
      return c.json({ error: "Prize not found" }, 500);
    }

    // Update opened cases
    const newOpenedCases = [...openedCases, caseNumber];
    await prisma.game.update({
      where: { GameID: gameId },
      data: { OpenedCases: newOpenedCases },
    });

    return c.json({
      caseNumber,
      prize: {
        PrizeID: prize.PrizeID,
        PrizeName: prize.PrizeName,
        PrizeValue: prize.PrizeValue.toNumber(),
        IsBlank: prize.IsBlank,
      },
      openedCases: newOpenedCases,
    });
  })

  .get("/banker-offer/:gameId", zValidator("param", z.object({ gameId: z.string() })), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const { gameId } = c.req.valid("param");

    const game = await prisma.game.findFirst({
      where: { GameID: gameId, PlayerUserID: userId, IsFinished: false },
      include: { event: { include: { prizePools: true } } },
    });
    if (!game) {
      return c.json({ error: "Game not found" }, 404);
    }

    const openedCases = game.OpenedCases as number[] || [];
    if (openedCases.length < 1) {
      return c.json({ error: "No cases opened yet" }, 400);
    }

    // Calculate remaining prizes' values
    const caseAssignments = game.CaseAssignments as { caseNumber: number; prizeId: string }[];
    const remainingCases = caseAssignments.filter(a => !openedCases.includes(a.caseNumber));
    const remainingPrizes = remainingCases.map(a => game.event.prizePools.find(p => p.PrizeID === a.prizeId)).filter(Boolean);
    const remainingValues = remainingPrizes.map(p => p!.PrizeValue.toNumber()).filter(v => v > 0);

    if (remainingValues.length === 0) {
      return c.json({ offer: 0 });
    }

    const mean = remainingValues.reduce((a, b) => a + b, 0) / remainingValues.length;
    const offer = Math.round(mean * 0.8); // Adjustable factor

    // Store offer in banker offers
    const bankerOffers = bankerOfferSchema.parse(game.BankerOffers) || [];
    bankerOffers.push({ amount: offer, accepted: false, atCaseCount: openedCases.length });
    await prisma.game.update({
      where: { GameID: gameId },
      data: { BankerOffers: bankerOffers },
    });

    return c.json({ offer });
  })

  .post("/accept-offer", zValidator("json", acceptOfferSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const { gameId, offerAmount } = c.req.valid("json");

    const game = await prisma.game.findFirst({
      where: { GameID: gameId, PlayerUserID: userId, IsFinished: false },
    });
    if (!game) {
      return c.json({ error: "Game not found" }, 404);
    }

    // Finish game with accepted offer
    await prisma.game.update({
      where: { GameID: gameId },
      data: {
        IsFinished: true,
        FinishedAt: new Date(),
        WonAmount: offerAmount,
      },
    });

    // Save to history
    await prisma.gameHistory.create({
      data: {
        EventID: game.EventID,
        PlayerUserID: userId,
        WonPrizeName: `Banker Offer: ${offerAmount}`,
        WonPrizeValue: offerAmount,
      },
    });

    return c.json({ message: "Offer accepted", wonAmount: offerAmount });
  })

  .post("/finish-game", zValidator("json", finishGameSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const { gameId, finalCase } = c.req.valid("json");

    const game = await prisma.game.findFirst({
      where: { GameID: gameId, PlayerUserID: userId, IsFinished: false },
      include: { event: { include: { prizePools: true } } },
    });
    if (!game) {
      return c.json({ error: "Game not found" }, 404);
    }

    // Find prize for final case
    const caseAssignments = game.CaseAssignments as { caseNumber: number; prizeId: string }[];
    const assignment = caseAssignments.find(a => a.caseNumber === finalCase);
    if (!assignment) {
      return c.json({ error: "Invalid final case" }, 400);
    }

    const prize = game.event.prizePools.find(p => p.PrizeID === assignment.prizeId);
    if (!prize) {
      return c.json({ error: "Prize not found" }, 500);
    }

    const wonAmount = prize.PrizeValue.toNumber();

    // Finish game
    await prisma.game.update({
      where: { GameID: gameId },
      data: {
        IsFinished: true,
        FinishedAt: new Date(),
        FinalPrizeID: prize.PrizeID,
        WonAmount: wonAmount,
      },
    });

    // Save to history
    await prisma.gameHistory.create({
      data: {
        EventID: game.EventID,
        PlayerUserID: userId,
        WonPrizeName: prize.PrizeName,
        WonPrizeValue: wonAmount,
      },
    });

    return c.json({
      message: "Game finished",
      finalPrize: {
        PrizeID: prize.PrizeID,
        PrizeName: prize.PrizeName,
        PrizeValue: wonAmount,
        IsBlank: prize.IsBlank,
      },
      wonAmount,
    });
  })

  .onError((error, c) => handleApiError(c, error));

export default app;