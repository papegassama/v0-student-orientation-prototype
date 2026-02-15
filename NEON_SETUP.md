# Neon Postgres Setup Guide

## Overview

MonOrienta has been successfully migrated from Firebase to Neon Postgres for authentication and data storage. This provides better performance, lower costs, and more control over your data.

## What Changed

### Removed
- Firebase SDK (`firebase` and `firebase-admin`)
- Firebase authentication system
- Google OAuth login (can be added back with proper implementation)
- Firestore database

### Added
- Neon Postgres database with `@neondatabase/serverless`
- Session-based authentication with bcrypt password hashing
- Secure HTTP-only cookies for session management
- PostgreSQL tables for users, sessions, quiz results, and orientation responses

## Database Schema

The following tables are automatically created:

### `user_profiles`
```sql
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- full_name (VARCHAR)
- password_hash (TEXT) - bcrypt hashed password
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `sessions`
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- token (TEXT, Unique) - Session token
- expires_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `quiz_results`
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- answers (JSONB)
- recommendations (JSONB)
- created_at (TIMESTAMP)
```

### `orientation_responses`
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- question_id (VARCHAR)
- response_data (JSONB)
- created_at (TIMESTAMP)
```

## Environment Variables

Add the following to your `.env.local` (development) or Vercel project variables (production):

```
DATABASE_URL=postgresql://user:password@host/database
```

The `DATABASE_URL` is provided by Neon and includes:
- User credentials
- Host (Neon's serverless endpoint)
- Database name

## Authentication Flow

### Sign Up
1. User enters email, password, and full name
2. Password is hashed using bcryptjs
3. User profile is created in `user_profiles` table
4. Session is created automatically
5. Session token is stored in HTTP-only cookie

### Login
1. User enters email and password
2. System verifies password hash matches
3. New session is created
4. Session token stored in HTTP-only cookie

### Session Management
- Sessions expire after 7 days
- User ID is passed via `x-user-id` header in API requests
- Expired sessions are automatically cleaned up

## API Changes

All API routes now use Neon instead of Firebase:

### Quiz Results (`/api/quiz-results`)
- **POST**: Create new quiz result
- **GET**: Fetch user's quiz results
- **DELETE** `/[id]`: Delete specific quiz result

### Orientation Responses (`/api/orientation-responses`)
- **POST**: Save orientation response
- **GET**: Fetch user's orientation responses

### Authentication Headers
All requests require the `x-user-id` header (automatically set by the auth context).

## Auth Utilities (`lib/auth-postgres.ts`)

Key functions:
- `signUp(email, password, fullName)` - Create new account
- `signIn(email, password)` - Authenticate user
- `signOut()` - Logout user
- `getCurrentUser()` - Get current authenticated user
- `saveQuizResult(userId, answers, recommendations)` - Save quiz
- `getQuizResults(userId)` - Retrieve quiz history
- `deleteQuizResult(userId, id)` - Delete quiz result
- `saveOrientationResponse(userId, questionId, responseData)` - Save response
- `getOrientationResponses(userId)` - Retrieve responses

## Database Connection

The app uses Neon's serverless PostgreSQL via `@neondatabase/serverless`:

```typescript
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Usage
const result = await sql`SELECT * FROM users WHERE id = ${userId}`
```

Benefits:
- ✅ Serverless - no connection pooling needed
- ✅ Automatic scaling
- ✅ Pay per query
- ✅ Connection pooling built-in

## Security Features

1. **Password Hashing**: Bcryptjs with salt rounds of 10
2. **Session Tokens**: Cryptographically secure random tokens
3. **HTTP-Only Cookies**: Prevents XSS attacks
4. **SQL Injection Prevention**: Parameterized queries
5. **CORS Protected**: API routes validate origin

## Deploying to Vercel

1. **Add Neon Integration**:
   - Go to Vercel dashboard
   - Add Neon integration
   - Select or create a Neon database
   - `DATABASE_URL` will be automatically set

2. **Deploy**:
   ```bash
   git push origin migrate-supabase-to-firebase
   ```

3. **Verify**:
   - Check that `DATABASE_URL` is set in production
   - Test sign up and login flows
   - Verify data persists in Neon

## Troubleshooting

### "DATABASE_URL is not set"
- Ensure `DATABASE_URL` environment variable is configured
- For local dev: Add to `.env.local`
- For Vercel: Add in project Settings > Environment Variables

### "Connection timeout"
- Check that Neon database is running
- Verify network access is allowed
- Check DATABASE_URL format is correct

### "Password verification failed"
- Ensure password is being hashed during signup
- Verify bcryptjs is properly installed
- Check password hash isn't corrupted

### Sessions not persisting
- Verify cookies are enabled
- Check cookie domain/path settings
- Ensure sessions table exists and has data

## Next Steps

1. Test the authentication flow locally
2. Deploy to Vercel staging environment
3. Verify all data operations work
4. Monitor Neon dashboard for usage
5. Set up automated backups in Neon console

## Support

For Neon issues, visit: https://neon.tech/docs
For Vercel issues, visit: https://vercel.com/docs
