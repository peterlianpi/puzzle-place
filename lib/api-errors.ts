import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// For API routes with Hono context
export function handleApiError(c: Context, error: unknown, defaultMessage?: string): Response {
  console.error('API Error:', error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const message = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return c.json({
      error: 'Validation failed',
      details: message,
      code: 'VALIDATION_ERROR',
      statusCode: 400,
    }, 400);
  }

  if (error instanceof ApiError) {
    return c.json({
      error: error.message,
      code: error.code || 'API_ERROR',
      statusCode: error.statusCode || 500,
    }, error.statusCode as ContentfulStatusCode);
  }

  if (error instanceof Error) {
    // Database/Prisma specific errors
    if (error.message.includes('Unique constraint')) {
      const message = 'A record with this information already exists';
      return c.json({
        error: message,
        code: 'DUPLICATE_RECORD',
        statusCode: 400,
      }, 400);
    }

    if (error.message.includes('Foreign key constraint')) {
      const message = 'Cannot perform this action due to related records';
      return c.json({
        error: message,
        code: 'RELATED_RECORDS_EXIST',
        statusCode: 400,
      }, 400);
    }

    if (error.message.includes('Record to update not found')) {
      const message = 'Record not found';
      return c.json({
        error: message,
        code: 'NOT_FOUND',
        statusCode: 404,
      }, 404);
    }

    // Development: Show detailed error messages
    if (process.env.NODE_ENV === 'development') {
      return c.json({
        error: error.message,
        code: 'INTERNAL_ERROR',
        statusCode: 500,
        stack: error.stack,
      }, 500);
    }
  }

  // Production: Generic error message
  const message = defaultMessage || 'An unexpected error occurred';
  return c.json({
    error: message,
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  }, 500);
}

// For server actions without Hono context
export function handleError(error: unknown, defaultMessage?: string): { error: string; code?: string } {
  console.error('Server Action Error:', error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const message = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return { error: 'Validation failed', code: 'VALIDATION_ERROR' };
  }

  if (error instanceof ApiError) {
    return { error: error.message, code: error.code || 'API_ERROR' };
  }

  if (error instanceof Error) {
    // Database/Prisma specific errors
    if (error.message.includes('Unique constraint')) {
      return { error: 'A record with this information already exists', code: 'DUPLICATE_RECORD' };
    }

    if (error.message.includes('Foreign key constraint')) {
      return { error: 'Cannot perform this action due to related records', code: 'RELATED_RECORDS_EXIST' };
    }

    if (error.message.includes('Record to update not found')) {
      return { error: 'Record not found', code: 'NOT_FOUND' };
    }

    // Development: Show detailed error messages
    if (process.env.NODE_ENV === 'development') {
      return { error: error.message, code: 'INTERNAL_ERROR' };
    }
  }

  // Production: Generic error message
  const message = defaultMessage || 'An unexpected error occurred';
  return { error: message, code: 'INTERNAL_ERROR' };
}
