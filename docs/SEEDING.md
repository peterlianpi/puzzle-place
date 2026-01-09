# Database Seeding Documentation

## Overview

Puzzle Place includes a comprehensive seed script that populates the database with sample users, accounts, game events, prize pools, and testimonials. The seed script is designed for development and testing environments.

## Seed Script Features

### Data Integrity Checks
- Validates that all prize pools reference existing events
- Ensures data consistency before insertion
- Prevents orphaned records

### Error Handling & Logging
- Comprehensive logging with timestamps for all operations
- Database connection retry logic with exponential backoff
- Graceful error handling with detailed error messages
- Automatic cleanup on failure

### Transaction Safety
- Uses database transactions for atomic operations
- Clears existing data in reverse dependency order
- Prevents partial data states

### Performance Optimizations
- Batched seeding in groups for better performance
- Progress logging every 5 events
- Efficient upsert operations to avoid duplicates

## Usage

### Basic Seeding
```bash
npm run seed
# or
npx tsx prisma/seed.ts
```

### Clear Existing Data
```bash
CLEAR_EXISTING=true npm run seed
# or
npx tsx prisma/seed.ts --clear
```

### Environment Variables
- `CLEAR_EXISTING=true`: Clears all existing seed data before seeding new data
- `DATABASE_URL`: PostgreSQL connection string (required)

## Seed Data Structure

### Game Events
The seed script creates 20+ sample game events including:
- Office-themed events with mix of high-value and troll prizes
- Cultural events (Burmese-themed with high-value cash prizes)
- Entertainment events (food, movies, games)
- Company events (KBZ company prizes)
- Fun social events (truth or dare, challenges)

### Prize Pools
Each event includes multiple prizes with:
- High-value items (electronics, cash)
- Medium-value items (food, vouchers)
- Low-value items (consumables)
- Troll/joke prizes (used tissue, stones, etc.)
- Blank entries for suspense

### Testimonials
Three sample testimonials from fictional users showcasing different aspects of the platform.

### Users
The seed script creates users for each unique event creator ID extracted from the game events data. Each user has:
- Unique ID matching the creator ID
- Generic name (e.g., "User 1")
- Email address (e.g., "user1@example.com")
- Username (e.g., "user1")
- Hashed password (placeholder)
- Email verified status set to true

### Accounts
For each seeded user, a credential account is created with:
- User ID linked to the corresponding user
- Provider ID set to "credential"
- Account ID matching the user's email
- Hashed password (placeholder)

## Prerequisites

1. **Database Connection**: Ensure `DATABASE_URL` is configured
2. **Prisma Client**: Generate client with `npx prisma generate`

## Seed Script Flow

1. **Connection Check**: Verifies database connectivity with retry logic
2. **Seed Users**: Creates users for event creators using upsert operations
3. **Seed Accounts**: Creates credential accounts linked to the seeded users
4. **Clear Phase** (optional): Removes existing seed data (accounts, users, testimonials, events, prizes) in reverse dependency order
5. **Data Validation**: Checks integrity of seed data relationships
6. **Seeding Events and Prizes**: Creates game events and their prize pools in transactions
7. **Seed Testimonials**: Adds sample testimonials with duplicate checking
8. **Completion**: Logs success and closes connection

## Error Scenarios

### Connection Issues
- Network errors, TLS issues, access denied
- Automatic retry with exponential backoff (up to 3 attempts)

### Data Integrity Violations
- Prizes referencing non-existent events
- Script halts with detailed error message

### Missing Dependencies
- Creator user not found in database
- Missing environment variables

## Performance Notes

- Seeding 20+ events with 200+ prizes completes in under 30 seconds
- Uses efficient Prisma operations (createMany, upsert)
- Minimal memory usage through streaming operations

## Customization

To modify seed data:
1. Edit `gameEvents`, `prizePool`, and `testimonials` arrays in `prisma/seed.ts`
2. Users and accounts are automatically generated from unique creator IDs in game events
3. Ensure data integrity (event IDs match between events and prizes)
4. Update validation logic if needed

## Troubleshooting

### Common Issues

**Connection timeouts**
- Check `DATABASE_URL` configuration
- Verify database server is running
- Check network connectivity

**Permission errors**
- Ensure database user has create/update permissions
- Check SSL settings if required

---

**Last Updated:** January 9, 2026
**Version:** 1.0.0