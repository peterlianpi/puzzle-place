import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUploadAvatar } from "./use-upload-avatar";

// Mock the client
vi.mock("@/lib/api/hono-client", () => ({
  client: {
    api: {
      avatar: {
        upload: {
          $post: vi.fn(),
        },
      },
    },
  },
}));

// Mock authClient
vi.mock("@/lib/auth/auth-client", () => ({
  authClient: {
    refetch: vi.fn(),
  },
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { client } from "@/lib/api/hono-client";
import { toast } from "sonner";

describe("useUploadAvatar", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
    // Spy on queryClient methods
    vi.spyOn(queryClient, "invalidateQueries");
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should upload avatar successfully", async () => {
    const mockResponse = {
      json: vi.fn().mockResolvedValue({
        success: true,
        imageUrl: "https://example.com/avatar.jpg",
      }),
    } as unknown as ReturnType<typeof client.api.avatar.upload.$post>;

    vi.mocked(client.api.avatar.upload.$post).mockResolvedValue(await mockResponse);

    const { result } = renderHook(() => useUploadAvatar(), { wrapper });

    result.current.mutate({ imageData: "data:image/png;base64,test" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(client.api.avatar.upload.$post).toHaveBeenCalledWith({
      json: { imageData: "data:image/png;base64,test" },
    });

    expect(toast.success).toHaveBeenCalledWith("Avatar uploaded successfully!");

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["user"],
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["get-user"],
    });
  });

  it("should handle upload error", async () => {
    vi.mocked(client.api.avatar.upload.$post).mockRejectedValue(new Error("Upload failed"));

    const { result } = renderHook(() => useUploadAvatar(), { wrapper });

    result.current.mutate({ imageData: "data:image/png;base64,test" });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toast.error).toHaveBeenCalledWith("Upload failed");
  });
});
