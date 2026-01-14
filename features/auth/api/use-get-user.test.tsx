import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetUser } from './use-get-user';

// Mock the client
vi.mock('@/lib/api/hono-client', () => ({
  client: {
    api: {
      "auth-user": {
        "get-user": {
          $get: vi.fn(),
        },
      },
    },
  },
}));

import { client } from '@/lib/api/hono-client';

describe('useGetUser', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch user data successfully', async () => {
    const mockUser = {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      emailVerified: true,
      image: 'https://example.com/avatar.jpg',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    };

    const mockResponse = {
      json: vi.fn().mockResolvedValue({ user: mockUser }),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (client.api["auth-user"]["get-user"].$get as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGetUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({ user: mockUser });
    expect(client.api["auth-user"]["get-user"].$get).toHaveBeenCalled();
  });

  it('should handle fetch error', async () => {
    const mockError = new Error('Failed to fetch user');
    (client.api["auth-user"]["get-user"].$get as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useGetUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
  });



  it('should enable query by default', () => {
    const { result } = renderHook(() => useGetUser(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });
});