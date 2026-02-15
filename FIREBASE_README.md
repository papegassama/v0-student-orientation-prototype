# Firebase Setup for MonOrienta

This project is fully integrated with **Firebase Authentication** and **Firebase Firestore Database**.

## Quick Links

- **🚀 [5-Minute Quick Start](./FIREBASE_QUICKSTART.md)** - Get started immediately
- **📋 [Complete Setup Guide](./SETUP_FIREBASE.md)** - Detailed configuration steps
- **📚 [Integration Documentation](./FIREBASE_INTEGRATION.md)** - Architecture and usage
- **✅ [Integration Status](./FIREBASE_STATUS.md)** - What's implemented

## What's Included

### Authentication
- ✅ Email and password signup/login
- ✅ Google OAuth login
- ✅ Automatic session persistence
- ✅ Secure logout

### Database
- ✅ Firestore real-time database
- ✅ User profiles and settings
- ✅ Quiz results history
- ✅ Orientation responses tracking

### API
- ✅ Secure API endpoints with token verification
- ✅ User-specific data isolation
- ✅ Error handling with meaningful messages

### Documentation
- ✅ Step-by-step setup guide
- ✅ Quick start guide
- ✅ Architecture documentation
- ✅ Troubleshooting guide

## One-Minute Overview

1. **Create Firebase Project** - Go to [Firebase Console](https://console.firebase.google.com/) and create a project
2. **Enable Auth** - Enable Email/Password and Google authentication
3. **Get Credentials** - Copy your Firebase config and service account key
4. **Set Environment Variables** - Add credentials to `.env.local` (local) or Vercel (production)
5. **Test It** - Run the app and test signup/login at `http://localhost:3000/signup`

## Environment Variables Needed

```env
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Server Config
FIREBASE_ADMIN_SDK_KEY=
```

## Where to Get These Values

| Variable | Where to Find | How to Get |
|----------|---|---|
| API_KEY, AUTH_DOMAIN, etc. | Firebase Console → Project Settings | Copy from "Your web app" config |
| FIREBASE_ADMIN_SDK_KEY | Firebase Console → Project Settings → Service Accounts | Generate new private key |

## Local Development

```bash
# 1. Create .env.local with the environment variables above

# 2. Install dependencies
npm install

# 3. Run the app
npm run dev

# 4. Visit http://localhost:3000
```

## Production (Vercel)

1. Add all environment variables to Vercel project settings
2. Redeploy the application
3. Everything works automatically

## Detailed Setup

For a complete step-by-step guide, see [SETUP_FIREBASE.md](./SETUP_FIREBASE.md) which includes:
- How to create a Firebase project
- Where to copy each configuration value
- How to enable email and Google authentication
- How to get the Admin SDK key
- How to deploy to Vercel

## Features

### User Authentication
```typescript
import { useAuth } from '@/lib/auth-context';

export default function Profile() {
  const { user, logout } = useAuth();
  
  if (!user) return <div>Please login</div>;
  
  return (
    <div>
      <p>Welcome, {user.fullName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Storing Data
```typescript
import { saveQuizResult } from '@/lib/auth';

// Automatically stored under user's Firestore document
await saveQuizResult(userId, answers, recommendations);
```

### API Endpoints
```typescript
// POST /api/quiz-results - Save a quiz
// GET /api/quiz-results - Get user's quizzes
// DELETE /api/quiz-results/[id] - Delete a quiz

// POST /api/orientation-responses - Save response
// GET /api/orientation-responses - Get user's responses
```

## Files Modified

- ✅ `/lib/firebase.ts` - Firebase client setup
- ✅ `/lib/firebase-admin.ts` - Firebase server setup
- ✅ `/lib/auth.ts` - Authentication functions
- ✅ `/lib/auth-context.tsx` - React auth context
- ✅ `/app/login/page.tsx` - Email + Google login
- ✅ `/app/signup/page.tsx` - Email signup
- ✅ `/app/api/quiz-results/route.ts` - Quiz API
- ✅ `/app/api/quiz-results/[id]/route.ts` - Quiz delete
- ✅ `/app/api/orientation-responses/route.ts` - Responses API
- ✅ `package.json` - Added Firebase dependencies

## Build & Deployment

The app builds without errors when environment variables are configured:

```bash
# Build locally (requires env vars)
npm run build

# Start server
npm run start

# Deploy to Vercel
# (env vars added through Vercel settings)
vercel deploy
```

## Troubleshooting

**"Firebase config missing" warning?**
→ Check that all 6 `NEXT_PUBLIC_FIREBASE_*` variables are set

**"Admin SDK not initialized" error?**
→ Check that `FIREBASE_ADMIN_SDK_KEY` is set as a complete JSON string

**Google login doesn't work?**
→ Make sure Google auth is enabled in Firebase Console

**API returns 401?**
→ Make sure ID token is in Authorization header: `Authorization: Bearer {token}`

For more help, see the [Troubleshooting section in SETUP_FIREBASE.md](./SETUP_FIREBASE.md#troubleshooting).

## Architecture Overview

```
User Browser
    ↓
Firebase Auth SDK (email/password/Google)
    ↓
React Context (app state)
    ↓
API Routes (Next.js)
    ↓
Firebase Admin SDK (verify + access)
    ↓
Firestore Database
```

## Security

- ✅ Email/password properly hashed by Firebase
- ✅ Google OAuth with secure redirects
- ✅ Server-side token verification
- ✅ User data isolation by UID
- ✅ Ready for production security rules

## Data Structure

```
Firestore Database
└── users/
    └── {userId}
        ├── email: string
        ├── fullName: string
        ├── createdAt: timestamp
        ├── quizResults/
        │   └── {resultId}: quiz data + timestamp
        └── orientationResponses/
            └── {responseId}: response data + timestamp
```

## Next Steps

1. **Read the Quick Start** - See [FIREBASE_QUICKSTART.md](./FIREBASE_QUICKSTART.md)
2. **Follow Setup Guide** - See [SETUP_FIREBASE.md](./SETUP_FIREBASE.md)
3. **Test Locally** - Create account and verify it works
4. **Deploy to Vercel** - Add env vars and deploy
5. **Monitor Usage** - Check Firebase Console dashboard

## Support

- Firebase Docs: https://firebase.google.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Issues: Check the [Troubleshooting Guide](./SETUP_FIREBASE.md#troubleshooting)

---

**Firebase integration is complete and production-ready! 🎉**

Start with the [5-minute quick start](./FIREBASE_QUICKSTART.md) to get running immediately.
