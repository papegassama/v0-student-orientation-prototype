# Firebase Integration Documentation

## Overview

MonOrienta uses **Firebase Authentication** and **Firebase Firestore** for a complete serverless backend solution. This document describes the integration architecture and how to use it.

## Architecture

### Authentication Flow

```
┌─────────────────┐
│   User Login    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Client-Side Firebase Auth              │
│  - Email/Password                       │
│  - Google OAuth                         │
│  - Session Management                   │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Firestore User Profile                 │
│  - User metadata stored in Firestore    │
│  - Persistent sessions via Firebase     │
└─────────────────────────────────────────┘
```

### API Request Flow

```
┌─────────────────────────────────┐
│   Client Application            │
└────────┬────────────────────────┘
         │
         │ 1. Get ID Token
         │
┌────────▼────────────────────────┐
│  Firebase Auth (Client-side)    │
└────────┬────────────────────────┘
         │
         │ 2. Send request with token
         │
┌────────▼────────────────────────┐
│  Next.js API Route              │
└────────┬────────────────────────┘
         │
         │ 3. Verify token
         │
┌────────▼────────────────────────┐
│  Firebase Admin SDK             │
│  - Verify ID token             │
│  - Access Firestore            │
└────────┬────────────────────────┘
         │
         │ 4. Return data
         │
┌────────▼────────────────────────┐
│  Client receives response       │
└─────────────────────────────────┘
```

## File Structure

```
lib/
├── firebase.ts              # Client-side Firebase config & initialization
├── firebase-admin.ts        # Server-side Firebase Admin SDK setup
├── auth.ts                  # Authentication & database functions
└── auth-context.tsx         # React Context for auth state management

app/
├── login/page.tsx           # Login page (email & Google)
├── signup/page.tsx          # Signup page (email)
├── api/
│   ├── quiz-results/        # Quiz results endpoints
│   └── orientation-responses/   # Orientation responses endpoints
```

## Key Features

### 1. Email/Password Authentication

**Sign Up:**
```typescript
import { signUp } from '@/lib/auth';

const user = await signUp(
  'test@example.com',
  'password123',
  'John Doe'
);
```

**Sign In:**
```typescript
import { signIn } from '@/lib/auth';

const user = await signIn('test@example.com', 'password123');
```

### 2. Google Authentication

**Sign In with Google:**
```typescript
import { signInWithGoogle } from '@/lib/auth';

const user = await signInWithGoogle();
```

### 3. Persistent Sessions

Firebase automatically manages session persistence. Users stay logged in even after:
- Browser refresh
- Page navigation
- Browser tab close/reopen (same browser)

### 4. Firestore Database

**Supported Operations:**
- Store user profiles
- Save quiz results
- Store orientation responses
- Automatic timestamps
- User-specific data isolation

## User Data Structure

### Users Collection

```json
{
  "users": {
    "user123": {
      "id": "user123",
      "email": "user@example.com",
      "fullName": "John Doe",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Quiz Results Subcollection

```json
{
  "users": {
    "user123": {
      "quizResults": {
        "result456": {
          "answers": { /* user answers */ },
          "recommendations": [ /* recommendations */ ],
          "createdAt": "2024-01-15T11:00:00Z"
        }
      }
    }
  }
}
```

### Orientation Responses Subcollection

```json
{
  "users": {
    "user123": {
      "orientationResponses": {
        "response789": {
          "questionId": "q1",
          "responseData": { /* response data */ },
          "createdAt": "2024-01-15T11:05:00Z"
        }
      }
    }
  }
}
```

## API Endpoints

### Quiz Results

**POST /api/quiz-results** - Save a quiz result
```bash
curl -X POST http://localhost:3000/api/quiz-results \
  -H "Authorization: Bearer {idToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": { "q1": "A", "q2": "B" },
    "recommendations": ["Career 1", "Career 2"]
  }'
```

**GET /api/quiz-results** - Get all quiz results for user
```bash
curl http://localhost:3000/api/quiz-results \
  -H "Authorization: Bearer {idToken}"
```

**DELETE /api/quiz-results/[id]** - Delete a quiz result
```bash
curl -X DELETE http://localhost:3000/api/quiz-results/{resultId} \
  -H "Authorization: Bearer {idToken}"
```

### Orientation Responses

**POST /api/orientation-responses** - Save orientation response
```bash
curl -X POST http://localhost:3000/api/orientation-responses \
  -H "Authorization: Bearer {idToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "question_id": "q1",
    "response_data": { "answer": "yes" }
  }'
```

**GET /api/orientation-responses** - Get all orientation responses
```bash
curl http://localhost:3000/api/orientation-responses \
  -H "Authorization: Bearer {idToken}"
```

## Using the Auth Context

### In Components

```typescript
'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function MyComponent() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.fullName}!</p>
      <p>Email: {user.email}</p>
      <button onClick={() => logout().then(() => router.push('/login'))}>
        Logout
      </button>
    </div>
  );
}
```

### Protected Routes

Wrap your layout with `AuthProvider`:

```typescript
// app/layout.tsx
import { AuthProvider } from '@/lib/auth-context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

## Environment Variables

**Required for Client-side:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Required for Server-side:**
- `FIREBASE_ADMIN_SDK_KEY` (JSON string)

See [SETUP_FIREBASE.md](./SETUP_FIREBASE.md) for detailed setup instructions.

## Error Handling

All auth functions throw errors with meaningful messages in French:

```typescript
try {
  await signUp('email@example.com', 'short', 'Name');
} catch (error) {
  console.error(error.message);
  // Error: "Le mot de passe doit contenir au moins 6 caractères"
}
```

Common errors:
- `"Cet email n'existe pas."` - User not found during login
- `"Le mot de passe est incorrect."` - Wrong password
- `"Cet email est déjà utilisé."` - Email already registered
- `"Le mot de passe doit contenir au moins 6 caractères."` - Weak password
- `"Trop de tentatives. Réessayez plus tard."` - Too many login attempts

## Security Best Practices

1. **Never expose private keys** - Keep `FIREBASE_ADMIN_SDK_KEY` secret
2. **Use HTTPS only** - Always use secure connections
3. **Implement rate limiting** - Prevent brute force attacks
4. **Validate input** - Always validate on both client and server
5. **Set security rules** - Protect Firestore data with security rules
6. **Monitor usage** - Check Firebase console for suspicious activity
7. **Rotate credentials** - Periodically update service account keys

## Firestore Security Rules

Example rules for production:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // Subcollections inherit parent rules
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

## Vercel Deployment Checklist

- [ ] All Firebase config added to Vercel environment variables
- [ ] `FIREBASE_ADMIN_SDK_KEY` is a complete JSON string
- [ ] Database is set to Production mode with security rules
- [ ] Google OAuth redirect URI includes your Vercel domain
- [ ] Email/Password and Google auth are enabled
- [ ] Tested signup/login after deployment
- [ ] Verified Firestore data appears in Firebase Console
- [ ] Set up Firebase monitoring and alerts

## Troubleshooting

### Users can't stay logged in
- Check browser localStorage is not blocked
- Verify Firebase config is correct
- Clear browser cache and try again

### API routes return 401
- Verify ID token is being sent in Authorization header
- Check `FIREBASE_ADMIN_SDK_KEY` is set on server
- Verify token hasn't expired

### Firestore data not appearing
- Check security rules allow write access
- Verify correct collection path and document ID
- Check browser console for errors

### Google login doesn't work
- Verify Google auth is enabled in Firebase Console
- Check authorized redirect URIs include your domain
- Verify `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is correct

## Learn More

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Database](https://firebase.google.com/docs/firestore)
- [Next.js on Vercel](https://vercel.com/docs)
