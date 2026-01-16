import { z } from "zod";

// Base schemas from Prisma types
export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  username: z.string().nullable(),
  email: z.string(),
  emailVerified: z.boolean().nullable(),
  image: z.string().nullable(),
  bio: z.string().nullable(),
  theme: z.string().nullable(),
  language: z.string().nullable(),
  timezone: z.string().nullable(),
  isProfilePublic: z.boolean().nullable(),
  showEmail: z.boolean().nullable(),
  showStats: z.boolean().nullable(),
  showActivity: z.boolean().nullable(),
  allowDataExport: z.boolean().nullable(),
  marketingEmails: z.boolean().nullable(),
  securityEmails: z.boolean().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const gameEventSchema = z.object({
  EventID: z.string(),
  CreatorUserID: z.string(),
  EventName: z.string(),
  Description: z.string().nullable(),
  IsActive: z.boolean(),
  CreatedAt: z.date(),
});

export const eventPrizePoolSchema = z.object({
  PrizeID: z.string(),
  EventID: z.string(),
  PrizeName: z.string(),
  PrizeValue: z.number(),
  DisplayOrder: z.number().nullable(),
  IsBlank: z.boolean(),
});

export const gameSchema = z.object({
  GameID: z.string(),
  EventID: z.string(),
  PlayerUserID: z.string(),
  CaseAssignments: z.any().nullable(), // Array of {caseNumber: number, prizeId: string}
  OpenedCases: z.array(z.number()).nullable(),
  IsFinished: z.boolean(),
  FinalPrizeID: z.string().nullable(),
  BankerOffers: z.any().nullable(), // Array of {amount: number, accepted: boolean, atCaseCount: number}
  StartedAt: z.date(),
  FinishedAt: z.date().nullable(),
  WonAmount: z.number().nullable(),
});

export const gameHistorySchema = z.object({
  HistoryID: z.string(),
  EventID: z.string(),
  PlayerUserID: z.string(),
  WonPrizeName: z.string().nullable(),
  WonPrizeValue: z.number().nullable(),
  PlayedAt: z.date(),
});

// API input schemas
export const createEventSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  prizePools: z.array(
    z.object({
      name: z.string().min(1, "Prize name is required"),
      value: z.number().min(0, "Prize value must be non-negative"),
    })
  ).min(5, "At least 5 prizes required").max(26, "Max 26 prizes"),
}).refine((data) => {
  const nonBlank = data.prizePools.filter(p => p.value > 0);
  return nonBlank.length >= 1;
}, "At least 1 non-blank prize required");

export const updateEventSchema = z.object({
  eventId: z.string(),
  eventName: z.string().min(1, "Event name is required").optional(),
  description: z.string().optional(),
  prizePools: z.array(
    z.object({
      name: z.string().min(1, "Prize name is required"),
      value: z.number().min(0, "Prize value must be non-negative"),
    })
  ).min(5, "At least 5 prizes required").max(26, "Max 26 prizes").optional(),
});

export const startGameSchema = z.object({
  eventId: z.string(),
});

export const openCaseSchema = z.object({
  gameId: z.string(),
  caseNumber: z.number().min(1).max(26),
});

export const acceptOfferSchema = z.object({
  gameId: z.string(),
  offerAmount: z.number(),
});

export const finishGameSchema = z.object({
  gameId: z.string(),
  finalCase: z.number().min(1).max(26),
});

// For UI state not from Prisma
export const gameplayStateSchema = z.object({
  gameId: z.string().nullable(),
  currentGame: gameSchema.nullable(),
  remainingCases: z.array(z.number()),
  openedCases: z.record(z.number(), z.object({
    caseNumber: z.number(),
    prize: eventPrizePoolSchema,
  })),
  bankerOffer: z.number().nullable(),
  isGameFinished: z.boolean(),
});

// Types inferred from schemas
export type User = z.infer<typeof userSchema>;
export type GameEvent = z.infer<typeof gameEventSchema>;
export type EventPrizePool = z.infer<typeof eventPrizePoolSchema>;
export type Game = z.infer<typeof gameSchema>;
export type GameHistory = z.infer<typeof gameHistorySchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type StartGameInput = z.infer<typeof startGameSchema>;
export type OpenCaseInput = z.infer<typeof openCaseSchema>;
export type AcceptOfferInput = z.infer<typeof acceptOfferSchema>;
export type FinishGameInput = z.infer<typeof finishGameSchema>;
export type GameplayState = z.infer<typeof gameplayStateSchema>;