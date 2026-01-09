# Puzzle Place Project Overview

## Description
Puzzle Place is a modern web application for creating and managing game events with prize pools. Users can create events, define prizes, and participate in games with real-time prize distribution.

## Technology Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library
- **React Query**: Data fetching and caching
- **Next Themes**: Dark/light mode support

### Backend
- **Hono**: Lightweight API framework
- **Better Auth**: Authentication library
- **Prisma**: ORM for PostgreSQL
- **PostgreSQL**: Database
- **Zod**: Schema validation

### Infrastructure
- **Next.js API Routes**: Server-side API
- **Cloudinary**: Image hosting and optimization
- **Nodemailer**: Email sending

## Project Structure

```
puzzle-place/
├── app/                    # Next.js app directory
│   ├── (authenticated)/   # Protected user pages
│   ├── (public)/          # Public pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── features/              # Feature-based modules
│   ├── auth/              # Authentication features
│   ├── events/            # Public events features
│   └── my-events/         # User events features
├── lib/                   # Core utilities
├── prisma/                # Database schema
├── providers/             # React providers
├── docs/                  # Documentation
└── public/                # Static assets
```

## Key Features

### Authentication
- Email/password authentication
- Google OAuth integration
- Email verification
- Password reset
- Rate limiting

### Game Events
- Create custom game events
- Edit existing events and prize pools
- Define prize pools with configurable prizes
- Public event browsing
- Event participation tracking
- Prize distribution history

### User Management
- Profile management
- Username system
- User activity tracking

### Security
- Content Security Policy
- HTTP Strict Transport Security
- Input validation
- Secure headers

## Database Schema

### Schema Updates
- **String IDs**: All IDs now use `String` type with `@default(cuid())` for unique, collision-resistant identifiers
- **Better Auth Compatibility**: Updated User, Session, Account, Verification models to match Better Auth requirements
- **Performance Indexes**: Added database indexes on frequently queried fields (CreatorUserID, IsActive, CreatedAt, etc.)

### Core Models
- **User**: User accounts with auth info, indexed on username, emailVerified, createdAt
- **Session**: Auth sessions with IP/user agent tracking
- **Account**: OAuth accounts linked to users
- **Verification**: Email verification tokens with expiration
- **GameEvent**: Game events with prizes, indexed on CreatorUserID, IsActive, CreatedAt
- **EventPrizePool**: Prize configurations, indexed on EventID
- **GameHistory**: Participation records, indexed on EventID and PlayerUserID
- **Log**: System logs with user relations and indexed on type, level, timestamp
- **Testimonial**: User testimonials with active status indexing

## API Endpoints

### Public Events
- `GET /api/events` - List active events (paginated)
- `GET /api/events/:id` - Get event details

### User Events (Protected)
- `GET /api/my-events` - List user's events (paginated)
- `POST /api/my-events` - Create event
- `GET /api/my-events/:id` - Get user's event details
- `PATCH /api/my-events/:id` - Update user's event
- `DELETE /api/my-events/:id` - Delete user's event

### Auth Endpoints
- `/api/auth/*` - Better Auth routes

## Development Setup

1. Install dependencies: `bun install`
2. Set up database: Configure PostgreSQL
3. Run migrations: `npx prisma db push`
4. Generate Prisma client: `npx prisma generate`
5. Start development server: `npm run dev`

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_URL`: Frontend URL
- `BETTER_AUTH_SECRET`: Auth secret
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `EMAIL_*`: Email service configuration

## Deployment

The application is designed for deployment on platforms like Vercel, Netlify, or self-hosted servers with PostgreSQL.

## Recent Improvements

See `SECURITY_PERFORMANCE_UPDATES.md` for recent security, performance, and speed enhancements.

---

**Last Updated:** January 9, 2026
**Version:** 1.0.0