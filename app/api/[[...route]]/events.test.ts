import { describe, it, expect, vi, beforeEach } from 'vitest';
import events from './events';
import { prisma } from '@/lib/db/prisma';

// Mock dependencies
vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    gameEvent: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

describe('/api/events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/events', () => {
    it('should return paginated events successfully', async () => {
      const mockEvents = [
        {
          EventID: 'event1',
          CreatorUserID: 'user1',
          EventName: 'Test Event',
          Description: 'Test Description',
          IsActive: true,
          CreatedAt: new Date('2024-01-01'),
          prizePools: [
            {
              PrizeID: 'prize1',
              PrizeName: 'First Prize',
              PrizeValue: 100.00,
              DisplayOrder: 1,
              IsBlank: false,
            },
          ],
        },
      ];

      (prisma.gameEvent.findMany as any).mockResolvedValue(mockEvents);
      (prisma.gameEvent.count as any).mockResolvedValue(1);

      const request = new Request('http://localhost:3000/?limit=20&offset=0');
      const response = await events.request(request);

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toEqual({
        events: [
          {
            EventID: 'event1',
            CreatorUserID: 'user1',
            EventName: 'Test Event',
            Description: 'Test Description',
            IsActive: true,
            CreatedAt: '2024-01-01T00:00:00.000Z',
            prizePools: [
              {
                PrizeID: 'prize1',
                PrizeName: 'First Prize',
                PrizeValue: '100',
                DisplayOrder: 1,
                IsBlank: false,
              },
            ],
          },
        ],
        pagination: {
          limit: 20,
          offset: 0,
          total: 1,
          hasMore: false,
        },
      });

      expect(prisma.gameEvent.findMany).toHaveBeenCalledWith({
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
        orderBy: { CreatedAt: 'desc' },
        take: 20,
        skip: 0,
      });
    });

    it('should handle pagination parameters', async () => {
      (prisma.gameEvent.findMany as any).mockResolvedValue([]);
      (prisma.gameEvent.count as any).mockResolvedValue(50);

      const request = new Request('http://localhost:3000/?limit=10&offset=20');
      const response = await events.request(request);

      expect(response.status).toBe(200);
      expect(prisma.gameEvent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 20,
        })
      );
    });

    it('should use default pagination values', async () => {
      (prisma.gameEvent.findMany as any).mockResolvedValue([]);
      (prisma.gameEvent.count as any).mockResolvedValue(0);

      const request = new Request('http://localhost:3000/');
      const response = await events.request(request);

      expect(response.status).toBe(200);
      expect(prisma.gameEvent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 20,
          skip: 0,
        })
      );
    });

    it('should set correct cache headers', async () => {
      (prisma.gameEvent.findMany as any).mockResolvedValue([]);
      (prisma.gameEvent.count as any).mockResolvedValue(0);

      const request = new Request('http://localhost:3000/');
      const response = await events.request(request);

      expect(response.headers.get('Cache-Control')).toBe('public, max-age=300');
    });

    it('should handle database errors', async () => {
      (prisma.gameEvent.findMany as any).mockRejectedValue(new Error('Database error'));

      const request = new Request('http://localhost:3000/');
      const response = await events.request(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('An unexpected error occurred');
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return single event successfully', async () => {
      const mockEvent = {
        EventID: 'event1',
        CreatorUserID: 'user1',
        EventName: 'Test Event',
        Description: 'Test Description',
        IsActive: true,
        CreatedAt: new Date('2024-01-01'),
        prizePools: [
          {
            PrizeID: 'prize1',
            PrizeName: 'First Prize',
            PrizeValue: 100.00,
            DisplayOrder: 1,
            IsBlank: false,
          },
        ],
      };

      (prisma.gameEvent.findFirst as any).mockResolvedValue(mockEvent);

      const request = new Request('http://localhost:3000/event1');
      const response = await events.request(request);

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toEqual({
        event: {
          EventID: 'event1',
          CreatorUserID: 'user1',
          EventName: 'Test Event',
          Description: 'Test Description',
          IsActive: true,
          CreatedAt: '2024-01-01T00:00:00.000Z',
          prizePools: [
            {
              PrizeID: 'prize1',
              PrizeName: 'First Prize',
              PrizeValue: '100',
              DisplayOrder: 1,
              IsBlank: false,
            },
          ],
        },
      });

      expect(response.headers.get('Cache-Control')).toBe('public, max-age=600');
    });

    it('should return 404 for non-existent event', async () => {
      (prisma.gameEvent.findFirst as any).mockResolvedValue(null);

      const request = new Request('http://localhost:3000/non-existent');
      const response = await events.request(request);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Event not found');
    });

    it('should return 404 for invalid ID', async () => {
      (prisma.gameEvent.findFirst as any).mockResolvedValue(null);

      const request = new Request('http://localhost:3000/invalid');
      const response = await events.request(request);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Event not found');
    });

    it('should handle database errors for single event', async () => {
      (prisma.gameEvent.findFirst as any).mockRejectedValue(new Error('Database error'));

      const request = new Request('http://localhost:3000/event1');
      const response = await events.request(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('An unexpected error occurred');
    });
  });
});