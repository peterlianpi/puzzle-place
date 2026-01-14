# API Reference Documentation

## Overview

Puzzle Place uses a modern API architecture built with **Hono** for routing, **Prisma** for database operations, **Zod** for validation, and **Better Auth** for authentication. The API is RESTful with JSON responses and includes comprehensive error handling.

## Architecture

### Key Features
- **Type-Safe**: Full TypeScript integration with inferred types
- **Validated**: Zod schemas for request/response validation
- **Cached**: HTTP caching headers for performance
- **Paginated**: Efficient data fetching with limit/offset
- **Secure**: Session-based authentication with ownership validation

### Base URL
```
/api
```

### Authentication
All protected endpoints require a valid session. Authentication is handled via HTTP-only cookies set by Better Auth.

## Endpoints

### Public Events

#### GET `/api/events`
List active game events with pagination.

**Query Parameters:**
- `limit` (optional): Number of events to return (default: 20, max: 100)
- `offset` (optional): Number of events to skip (default: 0)

**Response:**
```json
{
  "events": [
    {
      "EventID": "string",
      "CreatorUserID": "string",
      "EventName": "string",
      "Description": "string|null",
      "IsActive": true,
      "CreatedAt": "2026-01-09T10:00:00.000Z",
      "prizePools": [
        {
          "PrizeID": "string",
          "PrizeName": "string",
          "PrizeValue": "string",
          "DisplayOrder": 1,
          "IsBlank": false
        }
      ]
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 25,
    "hasMore": true
  }
}
```

**Headers:**
- `Cache-Control: public, max-age=300` (5 minutes)

#### GET `/api/events/:id`
Get detailed information about a specific event.

**Path Parameters:**
- `id`: Event ID (string)

**Response:**
```json
{
  "event": {
    "EventID": "string",
    "CreatorUserID": "string",
    "EventName": "string",
    "Description": "string|null",
    "IsActive": true,
    "CreatedAt": "2026-01-09T10:00:00.000Z",
    "prizePools": [...]
  }
}
```

**Headers:**
- `Cache-Control: public, max-age=600` (10 minutes)

### User Events (Protected)

#### POST `/api/my-events`
Create a new game event.

**Authentication:** Required

**Request Body:**
```json
{
  "eventName": "string (required, min length 1)",
  "description": "string (optional)",
  "prizes": [
    {
      "name": "string (required)",
      "value": "number (required, >= 0)",
      "isBlank": "boolean (optional, default false)"
    }
  ] (required, min 5 prizes, at least 1 non-blank)
}
```

**Response:**
```json
{
  "eventId": "string"
}
```

**Validation:**
- Event name required and non-empty
- Minimum 5 prizes required
- At least one non-blank prize required
- Prizes sorted by value (high to low) automatically

#### GET `/api/my-events`
List user's created events with pagination.

**Authentication:** Required

**Query Parameters:**
- `limit` (optional): Number of events (default: 20)
- `offset` (optional): Skip count (default: 0)

**Response:** Same structure as public events endpoint, filtered by user ownership.

**Headers:**
- `Cache-Control: public, max-age=300` (5 minutes)

#### GET `/api/my-events/:id`
Get detailed information about user's specific event.

**Authentication:** Required

**Path Parameters:**
- `id`: Event ID (string)

**Security:** Only returns events owned by the authenticated user.

**Response:** Same as public event details.

**Headers:**
- `Cache-Control: public, max-age=600` (10 minutes)

#### PATCH `/api/my-events/:id`
Update an existing event.

**Authentication:** Required

**Path Parameters:**
- `id`: Event ID (string)

**Request Body:**
```json
{
  "eventName": "string (optional)",
  "description": "string (optional)",
  "prizes": [
    {
      "name": "string",
      "value": "number",
      "isBlank": "boolean"
    }
  ] (optional, but if provided: min 5, at least 1 non-blank)
}
```

**Response:**
```json
{
  "message": "Event updated"
}
```

**Behavior:**
- Updates event details if provided
- Replaces all prize pools if prizes array is provided
- Validates ownership before allowing updates

#### DELETE `/api/my-events/:id`
Delete a user's event.

**Authentication:** Required

**Path Parameters:**
- `id`: Event ID (string)

**Response:**
```json
{
  "message": "Event deleted"
}
```

### Authentication Endpoints

#### Better Auth Routes
- `POST /api/auth/signin/*` - Sign in
- `POST /api/auth/signup/*` - Sign up
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session
- Various password reset and email verification endpoints

### Other Endpoints

#### Custom User Operations
- `POST /api/auth/set-username` - Set username
- `GET /api/auth/check-username` - Check username availability
- `GET /api/auth/user` - Get user profile

## Error Handling

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

### Error Response Format
```json
{
  "error": "Error message description"
}
```

### Common Errors
- **Validation Errors**: Zod validation failures with detailed messages
- **Authentication Errors**: Invalid or missing sessions
- **Ownership Errors**: Attempting to access/modify others' events
- **Not Found**: Invalid event IDs or non-existent resources

## Performance Features

### Caching
- Public endpoints cached for 5-10 minutes
- Reduces database load for popular events
- Cache-Control headers set appropriately

### Pagination
- Efficient handling of large datasets
- `hasMore` flag for client-side optimization
- Configurable limits with reasonable defaults

### Data Selection
- Only necessary fields fetched with Prisma `select`
- Optimized database queries
- Reduced response payload sizes

## Security

### Authentication
- Session-based with HTTP-only cookies
- Automatic session validation on protected routes
- CSRF protection via Better Auth

### Authorization
- Ownership validation for user-specific operations
- No cross-user data access
- Secure ID generation with CUIDs

### Validation
- Input sanitization with Zod schemas
- Type-safe operations throughout
- Protection against malformed requests

## Development

### Type Safety
All endpoints are fully typed with TypeScript. Request/response types are inferred from Zod schemas.

### Testing
API endpoints should be tested with:
- Authentication scenarios
- Validation edge cases
- Pagination parameters
- Error conditions

### Client Integration
Use React Query for efficient data fetching with automatic caching and synchronization.

---

**Last Updated:** January 9, 2026
**Version:** 1.0.0