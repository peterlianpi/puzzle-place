import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'test';
process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY = 'test';
process.env.CLOUDINARY_API_SECRET = 'test';