# Supabase to Firebase Migration Guide

## Overview
This project has been successfully migrated from Supabase to Firebase for authentication and Firestore database operations.

## Changes Made

### 1. New Firebase Configuration Files
- **`lib/firebase.ts`** - Client-side Firebase initialization
- **`lib/auth.ts`** - Firebase authentication utilities (signUp, signIn, signOut, getCurrentUser, etc.)
- **`lib/firebase-admin.ts`** - Server-side Firebase Admin SDK setup

### 2. Updated Files
- **`lib/auth-context.tsx`** - Refactored to use Firebase authentication instead of Supabase
- **`app/api/quiz-results/route.ts`** - Updated GET/POST endpoints to use Firestore
- **`app/api/quiz-results/[id]/route.ts`** - Updated DELETE endpoint to use Firestore
- **`app/api/orientation-responses/route.ts`** - Updated GET/POST endpoints to use Firestore
- **`package.json`** - Replaced Supabase dependencies with Firebase

### 3. Removed Files
- **`lib/supabase/client.ts`** - No longer needed
- **`lib/supabase/server.ts`** - No longer needed
- **`lib/supabase/middleware.ts`** - No longer needed

## Database Structure

### Firestore Collections
The new Firestore structure uses subcollections for better organization:

```
users/
  {userId}/
    quizResults/
      {resultId}: { answers, recommendations, createdAt }
    orientationResponses/
      {responseId}: { questionId, responseData, createdAt }
```

## Environment Variables Required

Add the following environment variables to your `.env.local` or Vercel project settings:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_ADMIN_SDK_KEY=your_admin_sdk_key_json
```

## API Authentication

All API routes now use Firebase ID tokens for authentication:

```typescript
// Client-side API calls
const user = auth.currentUser;
if (user) {
  const token = await user.getIdToken();
  const response = await fetch('/api/quiz-results', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}
```

## Key Differences from Supabase

1. **Authentication**: Uses Firebase Authentication instead of Supabase Auth
2. **Database**: Uses Firestore instead of PostgreSQL
3. **Data Structure**: Organized in Firestore subcollections instead of flat tables
4. **API Layer**: Admin SDK handles server-side database operations
5. **Timestamps**: Uses Firestore Timestamp objects instead of PostgreSQL timestamps

## Testing Checklist

- [ ] User registration works correctly
- [ ] User login works correctly
- [ ] Quiz results are saved to Firestore
- [ ] Quiz results can be retrieved
- [ ] Quiz results can be deleted
- [ ] Orientation responses are saved
- [ ] Orientation responses can be retrieved
- [ ] User logout works correctly

## Troubleshooting

### Firebase Initialization Error
Ensure all `NEXT_PUBLIC_FIREBASE_*` variables are set correctly in your environment.

### Authentication Token Error
Verify that the `FIREBASE_ADMIN_SDK_KEY` is properly formatted JSON and set in your environment.

### Firestore Permission Error
Check that your Firestore security rules allow the authenticated user to read/write to their own subcollections.

## Next Steps

1. Set up Firebase project if not already done
2. Add all required environment variables
3. Test authentication flow
4. Verify data persistence in Firestore
5. Deploy to production
