import { User, GameEvent, EventPrizePool, GameHistory, LeaderboardEntry } from './types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Alice Johnson',
    username: 'alice',
    email: 'alice@example.com',
    image: '/avatar1.jpg',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'user2',
    name: 'Bob Smith',
    username: 'bob',
    email: 'bob@example.com',
    image: '/avatar2.jpg',
    createdAt: new Date('2023-02-01'),
  },
  {
    id: 'user3',
    name: 'Charlie Brown',
    username: 'charlie',
    email: 'charlie@example.com',
    image: '/avatar3.jpg',
    createdAt: new Date('2023-03-01'),
  },
];

export const mockPrizePools: { [eventId: string]: EventPrizePool[] } = {
  event1: [
    { PrizeID: 'p1', EventID: 'event1', PrizeName: 'Trip to Paris', PrizeValue: 50000, DisplayOrder: 1, IsBlank: false },
    { PrizeID: 'p2', EventID: 'event1', PrizeName: 'Electric Car', PrizeValue: 30000, DisplayOrder: 2, IsBlank: false },
    { PrizeID: 'p3', EventID: 'event1', PrizeName: 'Cash Prize $10,000', PrizeValue: 10000, DisplayOrder: 3, IsBlank: false },
    { PrizeID: 'p4', EventID: 'event1', PrizeName: 'Smart TV', PrizeValue: 2000, DisplayOrder: 4, IsBlank: false },
    { PrizeID: 'p5', EventID: 'event1', PrizeName: 'Laptop', PrizeValue: 1500, DisplayOrder: 5, IsBlank: false },
    { PrizeID: 'p6', EventID: 'event1', PrizeName: 'Headphones', PrizeValue: 200, DisplayOrder: 6, IsBlank: false },
    { PrizeID: 'p7', EventID: 'event1', PrizeName: 'T-Shirt', PrizeValue: 50, DisplayOrder: 7, IsBlank: false },
    { PrizeID: 'p8', EventID: 'event1', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 8, IsBlank: true },
    { PrizeID: 'p9', EventID: 'event1', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 9, IsBlank: true },
    { PrizeID: 'p10', EventID: 'event1', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 10, IsBlank: true },
  ],
  event2: [
    { PrizeID: 'p11', EventID: 'event2', PrizeName: 'World Cruise', PrizeValue: 100000, DisplayOrder: 1, IsBlank: false },
    { PrizeID: 'p12', EventID: 'event2', PrizeName: 'Sports Car', PrizeValue: 40000, DisplayOrder: 2, IsBlank: false },
    { PrizeID: 'p13', EventID: 'event2', PrizeName: 'Cash $20,000', PrizeValue: 20000, DisplayOrder: 3, IsBlank: false },
    { PrizeID: 'p14', EventID: 'event2', PrizeName: 'Gaming PC', PrizeValue: 3000, DisplayOrder: 4, IsBlank: false },
    { PrizeID: 'p15', EventID: 'event2', PrizeName: 'Tablet', PrizeValue: 500, DisplayOrder: 5, IsBlank: false },
    { PrizeID: 'p16', EventID: 'event2', PrizeName: 'Book Set', PrizeValue: 100, DisplayOrder: 6, IsBlank: false },
    { PrizeID: 'p17', EventID: 'event2', PrizeName: 'Sticker Pack', PrizeValue: 20, DisplayOrder: 7, IsBlank: false },
    { PrizeID: 'p18', EventID: 'event2', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 8, IsBlank: true },
    { PrizeID: 'p19', EventID: 'event2', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 9, IsBlank: true },
  ],
  event3: [
    { PrizeID: 'p20', EventID: 'event3', PrizeName: 'Private Jet', PrizeValue: 200000, DisplayOrder: 1, IsBlank: false },
    { PrizeID: 'p21', EventID: 'event3', PrizeName: 'Diamond Ring', PrizeValue: 50000, DisplayOrder: 2, IsBlank: false },
    { PrizeID: 'p22', EventID: 'event3', PrizeName: 'Cash $50,000', PrizeValue: 50000, DisplayOrder: 3, IsBlank: false },
    { PrizeID: 'p23', EventID: 'event3', PrizeName: 'Luxury Watch', PrizeValue: 10000, DisplayOrder: 4, IsBlank: false },
    { PrizeID: 'p24', EventID: 'event3', PrizeName: 'Bicycle', PrizeValue: 800, DisplayOrder: 5, IsBlank: false },
    { PrizeID: 'p25', EventID: 'event3', PrizeName: 'Coffee Mug', PrizeValue: 15, DisplayOrder: 6, IsBlank: false },
    { PrizeID: 'p26', EventID: 'event3', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 7, IsBlank: true },
    { PrizeID: 'p27', EventID: 'event3', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 8, IsBlank: true },
    { PrizeID: 'p28', EventID: 'event3', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 9, IsBlank: true },
    { PrizeID: 'p29', EventID: 'event3', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 10, IsBlank: true },
    { PrizeID: 'p30', EventID: 'event3', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 11, IsBlank: true },
  ],
  event4: [
    { PrizeID: 'p31', EventID: 'event4', PrizeName: 'House', PrizeValue: 300000, DisplayOrder: 1, IsBlank: false },
    { PrizeID: 'p32', EventID: 'event4', PrizeName: 'Motorcycle', PrizeValue: 15000, DisplayOrder: 2, IsBlank: false },
    { PrizeID: 'p33', EventID: 'event4', PrizeName: 'Cash $5,000', PrizeValue: 5000, DisplayOrder: 3, IsBlank: false },
    { PrizeID: 'p34', EventID: 'event4', PrizeName: 'Phone', PrizeValue: 1000, DisplayOrder: 4, IsBlank: false },
    { PrizeID: 'p35', EventID: 'event4', PrizeName: 'Hat', PrizeValue: 30, DisplayOrder: 5, IsBlank: false },
    { PrizeID: 'p36', EventID: 'event4', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 6, IsBlank: true },
    { PrizeID: 'p37', EventID: 'event4', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 7, IsBlank: true },
    { PrizeID: 'p38', EventID: 'event4', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 8, IsBlank: true },
  ],
  event5: [
    { PrizeID: 'p39', EventID: 'event5', PrizeName: 'Yacht', PrizeValue: 250000, DisplayOrder: 1, IsBlank: false },
    { PrizeID: 'p40', EventID: 'event5', PrizeName: 'Gold Bar', PrizeValue: 50000, DisplayOrder: 2, IsBlank: false },
    { PrizeID: 'p41', EventID: 'event5', PrizeName: 'Cash $25,000', PrizeValue: 25000, DisplayOrder: 3, IsBlank: false },
    { PrizeID: 'p42', EventID: 'event5', PrizeName: 'Drone', PrizeValue: 800, DisplayOrder: 4, IsBlank: false },
    { PrizeID: 'p43', EventID: 'event5', PrizeName: 'Keychain', PrizeValue: 10, DisplayOrder: 5, IsBlank: false },
    { PrizeID: 'p44', EventID: 'event5', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 6, IsBlank: true },
    { PrizeID: 'p45', EventID: 'event5', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 7, IsBlank: true },
    { PrizeID: 'p46', EventID: 'event5', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 8, IsBlank: true },
    { PrizeID: 'p47', EventID: 'event5', PrizeName: 'Blank', PrizeValue: 0, DisplayOrder: 9, IsBlank: true },
  ],
};

export const mockEvents: GameEvent[] = [
  {
    EventID: 'event1',
    CreatorUserID: 'user1',
    EventName: 'Summer Splash',
    Description: 'Exciting prizes for the summer season!',
    IsActive: true,
    CreatedAt: new Date('2024-01-01'),
    prizePools: mockPrizePools.event1,
  },
  {
    EventID: 'event2',
    CreatorUserID: 'user2',
    EventName: 'Winter Wonderland',
    Description: 'Cozy prizes to warm your heart.',
    IsActive: true,
    CreatedAt: new Date('2024-02-01'),
    prizePools: mockPrizePools.event2,
  },
  {
    EventID: 'event3',
    CreatorUserID: 'user3',
    EventName: 'Luxury Extravaganza',
    Description: 'The most luxurious prizes ever!',
    IsActive: true,
    CreatedAt: new Date('2024-03-01'),
    prizePools: mockPrizePools.event3,
  },
  {
    EventID: 'event4',
    CreatorUserID: 'user1',
    EventName: 'Tech Bonanza',
    Description: 'Gadgets and tech for everyone.',
    IsActive: false,
    CreatedAt: new Date('2024-04-01'),
    prizePools: mockPrizePools.event4,
  },
  {
    EventID: 'event5',
    CreatorUserID: 'user2',
    EventName: 'Adventure Awaits',
    Description: 'Prizes that take you on adventures.',
    IsActive: true,
    CreatedAt: new Date('2024-05-01'),
    prizePools: mockPrizePools.event5,
  },
];

export const mockHistory: GameHistory[] = [
  {
    HistoryID: 'h1',
    EventID: 'event1',
    PlayerUserID: 'user2',
    WonPrizeName: 'Trip to Paris',
    WonPrizeValue: 50000,
    PlayedAt: new Date('2024-06-01'),
  },
  {
    HistoryID: 'h2',
    EventID: 'event2',
    PlayerUserID: 'user3',
    WonPrizeName: 'Blank',
    WonPrizeValue: 0,
    PlayedAt: new Date('2024-06-02'),
  },
  {
    HistoryID: 'h3',
    EventID: 'event3',
    PlayerUserID: 'user1',
    WonPrizeName: 'Cash $50,000',
    WonPrizeValue: 50000,
    PlayedAt: new Date('2024-06-03'),
  },
  // Add more for leaderboard
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, playerName: 'Alice Johnson', eventName: 'Luxury Extravaganza', prizeWon: '$50,000', date: new Date('2024-06-03') },
  { rank: 2, playerName: 'Charlie Brown', eventName: 'Summer Splash', prizeWon: 'Trip to Paris', date: new Date('2024-06-01') },
  { rank: 3, playerName: 'Bob Smith', eventName: 'Luxury Extravaganza', prizeWon: '$30,000 Car', date: new Date('2024-06-04') },
  // Add up to 1000, but mock with 10 for now
];