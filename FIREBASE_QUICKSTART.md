# Firebase Quick Start

Get Firebase running in 5 minutes.

## 1. Create Firebase Project

Visit [Firebase Console](https://console.firebase.google.com/) and create a new project.

## 2. Get Your Config

1. Register a Web app in Firebase Console
2. Copy the Firebase config values:
   ```
   apiKey, authDomain, projectId, storageBucket, 
   messagingSenderId, appId
   ```

## 3. Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google**

## 4. Get Admin Key

1. Go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Copy the entire JSON file contents

## 5. Set Environment Variables

Create `.env.local`:

```env
# Copy your config values here
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Paste entire service account JSON here (one line)
FIREBASE_ADMIN_SDK_KEY={"type":"service_account",...}
```

## 6. Test It

```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000/signup` and create an account.

## 7. Deploy to Vercel

1. Add the same environment variables to Vercel project settings
2. Redeploy
3. Test login at your Vercel URL

## 8. Configure Firestore Security

Go to Firestore Database and add security rules:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

Done! Your Firebase integration is complete.

## Troubleshooting

| Error | Fix |
|-------|-----|
| "Firebase config missing" | Check `.env.local` has all 6 `NEXT_PUBLIC_*` variables |
| "Admin SDK not initialized" | Check `FIREBASE_ADMIN_SDK_KEY` is set (entire JSON) |
| "Operation not allowed" | Enable auth methods in Firebase Console |
| Google login fails | Check auth domain authorized URIs include your domain |

For detailed setup, see [SETUP_FIREBASE.md](./SETUP_FIREBASE.md).
