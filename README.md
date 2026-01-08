# Puzzle Place

A modern web application for creating and managing game events with prize pools. Users can create events, define prizes, and participate in games with real-time prize distribution.

## Features

- 🔐 **Authentication**: Secure email/password and Google OAuth login
- 🎮 **Game Events**: Create, view, edit, and manage prize-based events
- 🏆 **Prize Pools**: Fully configurable prize systems with real-time editing
- 📊 **User Management**: Personal event dashboard and activity tracking
- 🎨 **Modern UI**: Fully responsive design with reusable components
- 🚀 **Performance**: Optimized with caching, pagination, and skeleton loading
- 🔒 **Security**: Comprehensive security with CSP, HSTS, rate limiting, and ownership validation
- 📱 **Mobile-First**: Optimized for all devices with touch-friendly interactions
- 📱 **Mobile Friendly**: Fully responsive across all devices

## Technology Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Hono, Better Auth, Prisma, PostgreSQL
- **Deployment**: Vercel-ready with optimized builds

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd puzzle-place
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create `.env.local` with required variables (see `.env.example`)

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000)**

## Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
EMAIL_FROM="..."
EMAIL_SMTP_HOST="..."
EMAIL_SMTP_PORT="587"
EMAIL_SMTP_USER="..."
EMAIL_SMTP_PASS="..."
```

## Project Structure

```
puzzle-place/
├── app/                    # Next.js App Router
│   ├── (authenticated)/    # Protected pages
│   ├── (public)/          # Public pages
│   └── api/               # API routes
├── components/             # Reusable UI components
├── features/               # Feature-based modules
│   ├── auth/              # Authentication features
│   ├── events/            # Public events features
│   └── my-events/         # User events features
├── lib/                    # Core utilities and configs
├── prisma/                 # Database schema and migrations
├── docs/                   # Documentation
├── providers/              # React context providers
└── public/                 # Static assets
```

## API Endpoints

### Public Events
- `GET /api/events` - List active events (paginated)
- `GET /api/events/:id` - Event details

### User Events (Protected)
- `GET /api/my-events` - List user's events (paginated)
- `POST /api/my-events` - Create event
- `GET /api/my-events/:id` - Get user's event details
- `PATCH /api/my-events/:id` - Update user's event
- `DELETE /api/my-events/:id` - Delete user's event

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database

## Documentation

- [Project Info](docs/PROJECT_INFO.md) - Detailed project overview
- [Security & Performance Updates](docs/SECURITY_PERFORMANCE_UPDATES.md) - Recent improvements

## Deployment

### Vercel
1. Connect your repository to Vercel
2. Add environment variables
3. Deploy automatically on push

### Manual
```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
