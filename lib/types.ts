// Types matching Prisma schema for Puzzle Place

export interface User {
  id: string;
  name?: string;
  username?: string;
  email: string;
  image?: string;
  createdAt: Date;
  PasswordHash?: string;
}

export interface GameEvent {
  EventID: string;
  CreatorUserID: string;
  EventName: string;
  Description?: string;
  IsActive: boolean;
  CreatedAt: Date;
  creator?: User;
  prizePools: EventPrizePool[];
}

export interface EventPrizePool {
  PrizeID: string;
  EventID: string;
  PrizeName: string;
  PrizeValue: number; // Decimal as number
  DisplayOrder?: number;
  IsBlank: boolean;
}

export interface GameHistory {
  HistoryID: string;
  EventID: string;
  PlayerUserID: string;
  WonPrizeName?: string;
  WonPrizeValue?: number; // Decimal as number
  PlayedAt: Date;
  playerUser?: User;
  event?: GameEvent;
}

// Additional types for UI
export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  eventName: string;
  prizeWon: string;
  date: Date;
}

export interface GameState {
  eventId: string;
  playerCase?: number;
  openedCases: number[];
  remainingCases: number[];
  currentOffer?: number;
  phase: 'pick-case' | 'elimination' | 'banker-offer' | 'final-swap' | 'finished';
  wonPrize?: EventPrizePool;
  caseValues: { [caseNum: number]: EventPrizePool };
}