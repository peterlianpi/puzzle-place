import { describe, it, expect, vi } from 'vitest';

// Mock server-only before importing anything that uses it
vi.mock('server-only', () => ({}));

import { ApiError, handleApiError, handleError } from './api-errors';
import { ZodError } from 'zod';

// Mock context type for testing
interface MockContext {
  json: (data: unknown, status?: number) => Response;
}

describe('API Error Handling', () => {
  describe('ApiError class', () => {
    it('should create ApiError with message and status', () => {
      const error = new ApiError('Test error', 400, 'VALIDATION_ERROR');

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.name).toBe('ApiError');
    });

    it('should use default status code', () => {
      const error = new ApiError('Test error');

      expect(error.statusCode).toBe(500);
    });
  });

  describe('handleApiError', () => {
    it('should handle Zod validation errors', () => {
      const zodError = new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          path: ['email'],
          message: 'Expected string, received number',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      ]);

      // Create a mock context
      const mockContext: MockContext = {
        json: vi.fn().mockReturnValue(new Response()),
      };

      const result = handleApiError(mockContext as unknown as Parameters<typeof handleApiError>[0], zodError);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          error: 'Validation failed',
          details: 'email: Expected string, received number',
          code: 'VALIDATION_ERROR',
          statusCode: 400,
        },
        400
      );
    });

    it('should handle ApiError instances', () => {
      const apiError = new ApiError('Custom error', 404, 'NOT_FOUND');

      const mockContext = {
        json: vi.fn().mockReturnValue(new Response()),
      };

      const result = handleApiError(mockContext as unknown as Parameters<typeof handleApiError>[0], apiError);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          error: 'Custom error',
          code: 'NOT_FOUND',
          statusCode: 404,
        },
        404
      );
    });

    it('should handle database unique constraint errors', () => {
      const dbError = new Error('Unique constraint failed on email');

      const mockContext = {
        json: vi.fn().mockReturnValue(new Response()),
      };

      const result = handleApiError(mockContext as unknown as Parameters<typeof handleApiError>[0], dbError);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          error: 'A record with this information already exists',
          code: 'DUPLICATE_RECORD',
          statusCode: 400,
        },
        400
      );
    });

    it('should handle database foreign key constraint errors', () => {
      const dbError = new Error('Foreign key constraint failed');

      const mockContext = {
        json: vi.fn().mockReturnValue(new Response()),
      };

      const result = handleApiError(mockContext as unknown as Parameters<typeof handleApiError>[0], dbError);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          error: 'Cannot perform this action due to related records',
          code: 'RELATED_RECORDS_EXIST',
          statusCode: 400,
        },
        400
      );
    });

    it('should handle database connection errors', () => {
      const dbError = Object.assign(new Error('Connection timeout'), { code: 'P1017' });

      const mockContext = {
        json: vi.fn().mockReturnValue(new Response()),
      };

      const result = handleApiError(mockContext as unknown as Parameters<typeof handleApiError>[0], dbError);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          error: 'Database connection failed. Please try again later.',
          code: 'DB_CONNECTION_ERROR',
          statusCode: 500,
        },
        500
      );
    });

    it('should handle generic errors in development', () => {
      const originalEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = 'development';

      const genericError = new Error('Something went wrong');

      const mockContext = {
        json: vi.fn().mockReturnValue(new Response()),
      };

      const result = handleApiError(mockContext as unknown as Parameters<typeof handleApiError>[0], genericError);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          error: 'Something went wrong',
          code: 'INTERNAL_ERROR',
          statusCode: 500,
          stack: genericError.stack,
        },
        500
      );

      // Restore original env
      (process.env as any).NODE_ENV = originalEnv;
    });

    it('should handle generic errors in production', () => {
      const originalEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = 'production';

      const genericError = new Error('Something went wrong');

      const mockContext = {
        json: vi.fn().mockReturnValue(new Response()),
      };

      const result = handleApiError(mockContext as unknown as Parameters<typeof handleApiError>[0], genericError);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          error: 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
          statusCode: 500,
        },
        500
      );

      (process.env as any).NODE_ENV = originalEnv;
    });
  });

  describe('handleError (server actions)', () => {
    it('should handle Zod validation errors', () => {
      const zodError = new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          path: ['email'],
          message: 'Expected string, received number',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      ]);

      const result = handleError(zodError);

      expect(result).toEqual({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
      });
    });

    it('should handle ApiError instances', () => {
      const apiError = new ApiError('Custom error', 404, 'NOT_FOUND');

      const result = handleError(apiError);

      expect(result).toEqual({
        error: 'Custom error',
        code: 'NOT_FOUND',
      });
    });

    it('should handle database errors', () => {
      const dbError = new Error('Unique constraint failed on email');

      const result = handleError(dbError);

      expect(result).toEqual({
        error: 'A record with this information already exists',
        code: 'DUPLICATE_RECORD',
      });
    });

    it('should handle generic errors in development', () => {
      const originalEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = 'development';

      const genericError = new Error('Something went wrong');

      const result = handleError(genericError);

      expect(result).toEqual({
        error: 'Something went wrong',
        code: 'INTERNAL_ERROR',
      });

      (process.env as any).NODE_ENV = originalEnv;
    });

    it('should handle generic errors in production', () => {
      const originalEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = 'production';

      const genericError = new Error('Something went wrong');

      const result = handleError(genericError);

      expect(result).toEqual({
        error: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
      });

      (process.env as any).NODE_ENV = originalEnv;
    });
  });
});