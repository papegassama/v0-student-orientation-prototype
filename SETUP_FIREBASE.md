# Firebase Setup Guide for MonOrienta

This guide explains how to fully configure Firebase for the MonOrienta application with authentication and Firestore database.

## Table of Contents

1. [Create a Firebase Project](#create-a-firebase-project)
2. [Get Your Firebase Configuration](#get-your-firebase-configuration)
3. [Enable Email/Password Authentication](#enable-emailpassword-authentication)
4. [Enable Google Authentication](#enable-google-authentication)
5. [Get Your Admin SDK Key](#get-your-admin-sdk-key)
6. [Add Environment Variables](#add-environment-variables)
7. [Verify the Setup](#verify-the-setup)

---

## Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., `monorienta`)
4. Click **"Continue"**
5. Select **"Disable Google Analytics"** (optional, not needed for this setup)
6. Click **"Create project"**
7. Wait for the project to be created (this may take a minute)
8. Click **"Continue"** when the project is ready

---

## Get Your Firebase Configuration

### Step 1: Register Your Web App

1. In the Firebase Console, you should see your project dashboard
2. Click the **"Web"** icon (</>) to register a web app
3. Enter an app nickname (e.g., `MonOrienta Web`)
4. Check the box for **"Also set up Firebase Hosting"** (optional)
5. Click **"Register app"**

### Step 2: Copy Your Firebase Config

After registering, you'll see a JavaScript configuration block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "project-id.firebaseapp.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

**Copy these values** - you'll need them in the next section.

---

## Enable Email/Password Authentication

1. In the Firebase Console, go to **Authentication** (left sidebar)
2. Click the **"Sign-in method"** tab
3. Click **"Email/Password"**
4. Toggle **"Enable"** to ON
5. Make sure **"Password"** is enabled (not just email link)
6. Click **"Save"**

---

## Enable Google Authentication

1. In the **Authentication** section, still in the **"Sign-in method"** tab
2. Click **"Google"**
3. Toggle **"Enable"** to ON
4. Select a **"Project support email"** from the dropdown (your project email)
5. You can customize the **"Public-facing name"** if desired
6. Click **"Save"**

---

## Get Your Admin SDK Key

### Step 1: Create a Service Account

1. In the Firebase Console, go to **Project Settings** (gear icon, top right)
2. Click the **"Service Accounts"** tab
3. Click **"Generate New Private Key"** button
4. A JSON file will download to your computer
5. **Open the downloaded file** and copy its entire contents

### Step 2: Format the Key

The file should look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

**Copy the entire JSON** - this is your `FIREBASE_ADMIN_SDK_KEY`.

---

## Add Environment Variables

### Local Development

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add these environment variables with the values you collected:

```env
# Firebase Client Config (from firebaseConfig)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...

# Firebase Admin SDK Key (from service account JSON - paste the entire JSON as one line)
FIREBASE_ADMIN_SDK_KEY={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",...}
```

### Vercel Deployment

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add each environment variable from above:
   - Add `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Add `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - Add `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - Add `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - Add `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - Add `NEXT_PUBLIC_FIREBASE_APP_ID`
   - Add `FIREBASE_ADMIN_SDK_KEY` (paste the entire service account JSON)

4. For the `NEXT_PUBLIC_*` variables, select **"Production, Preview, Development"**
5. For `FIREBASE_ADMIN_SDK_KEY`, select **"Production, Preview, Development"**
6. Click **"Save"**
7. Redeploy your application

---

## Verify the Setup

### Local Testing

1. Run your development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. Navigate to `http://localhost:3000/signup`

3. Try to create an account with:
   - **Full Name**: Test User
   - **Email**: test@example.com
   - **Password**: Password123

4. If successful, you should be redirected to the orientation page

5. Check Firebase Console to verify the user was created:
   - Go to **Authentication** → **Users**
   - You should see your test user listed

### Google Login Testing

1. Click the "Connexion Google" button
2. Sign in with your Google account
3. You should be redirected to the orientation page
4. Check Firebase to verify the user was created

### Database Verification

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"** if you haven't already
3. Start in **"Production mode"** with security rules
4. After signup, you should see a `users` collection with your user document

---

## Troubleshooting

### "Firebase config missing" warning

If you see this warning in the console, check that all `NEXT_PUBLIC_FIREBASE_*` environment variables are properly set.

**Solution:**
- Verify all 6 environment variables are in `.env.local` (for local) or Vercel (for production)
- Restart your development server
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

### "Firebase Admin SDK not initialized" error

This error means the `FIREBASE_ADMIN_SDK_KEY` environment variable is missing or invalid on the server.

**Solution:**
- Check that `FIREBASE_ADMIN_SDK_KEY` is set in Vercel environment variables
- Verify it's the complete service account JSON (one long line)
- Redeploy after adding the variable

### Authentication fails with "Operation not allowed"

This means Email/Password or Google authentication is not enabled in Firebase.

**Solution:**
- Go to Firebase Console → Authentication → Sign-in method
- Make sure both **Email/Password** and **Google** are enabled (green toggles)
- Save changes
- Wait 1-2 minutes for changes to propagate
- Clear browser cache and try again

### "This site can't be reached" on Google login redirect

This usually means your authorized redirect URIs are not configured.

**Solution:**
- Go to Firebase Console → Project Settings → OAuth consent screen
- Check that your application's URL is authorized
- For local development, make sure `http://localhost:3000` is added
- For Vercel, make sure your Vercel deployment URL is added

---

## Architecture Overview

### Client-Side (Browser)
- Uses `firebase` SDK for authentication and Firestore database access
- Runs in the browser with `NEXT_PUBLIC_FIREBASE_*` config
- Handles user signup, login, and data persistence

### Server-Side (API Routes)
- Uses `firebase-admin` SDK for server-side operations
- Authenticated with `FIREBASE_ADMIN_SDK_KEY`
- Verifies user tokens before processing requests
- Handles quiz results and orientation responses

### Database Structure (Firestore)

```
users/
  └── {userId}
      ├── id: string
      ├── email: string
      ├── fullName: string
      ├── createdAt: timestamp
      ├── quizResults/
      │   └── {resultId}
      │       ├── answers: object
      │       ├── recommendations: array
      │       └── createdAt: timestamp
      └── orientationResponses/
          └── {responseId}
              ├── questionId: string
              ├── responseData: object
              └── createdAt: timestamp
```

---

## Security Notes

1. **Never commit `.env.local`** - Add it to `.gitignore`
2. **Never share your Admin SDK key** - It has full database access
3. **Use Firestore Security Rules** to protect user data
4. **IP Whitelist** API keys if possible in Firebase Console
5. **Enable 2FA** on your Firebase project for production

---

## Next Steps

1. Test user authentication in your local environment
2. Create security rules for Firestore
3. Set up Firebase backup and recovery
4. Monitor Firebase usage and billing alerts
5. Set up Firebase Analytics (optional)

For more information, visit the [Firebase Documentation](https://firebase.google.com/docs).
