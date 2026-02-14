# Google OAuth Setup Guide for MonOrienta

## Current Status

Your application is **fully configured** for Google OAuth. The code is production-ready with:
- ✅ Supabase client setup (browser & server)
- ✅ OAuth callback handler (`/auth/callback`)
- ✅ Session persistence via Supabase middleware
- ✅ Auth state management with real-time listeners
- ✅ Cross-device session sync

**What's missing:** Google provider needs to be enabled in your Supabase project.

---

## Step 1: Get Google OAuth Credentials

### 1a. Go to Google Cloud Console

1. Open https://console.cloud.google.com/
2. Create a new project or select an existing one
3. In the top-left, click the project dropdown and create a new project called "MonOrienta"

### 1b. Enable Google+ API

1. Go to APIs & Services → Library
2. Search for "Google+ API"
3. Click on it and press **Enable**

### 1c. Create OAuth 2.0 Credentials

1. Go to APIs & Services → Credentials
2. Click **Create Credentials** → OAuth 2.0 Client ID
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in app name: "MonOrienta"
   - Add your email
   - Skip optional fields, click Save and Continue
4. Back to credentials creation, select **Web application**
5. Add authorized redirect URIs:
   ```
   http://localhost:3000/auth/callback
   https://your-vercel-domain.vercel.app/auth/callback
   https://your-custom-domain.com/auth/callback
   ```
   (Add your actual domain when deployed)
6. Click Create
7. Copy the **Client ID** and **Client Secret** - you'll need these for Supabase

---

## Step 2: Configure Supabase Google Provider

### 2a. Go to Supabase Dashboard

1. Open https://app.supabase.com/
2. Select your MonOrienta project
3. Go to **Authentication** → **Providers**

### 2b. Enable Google

1. Click on **Google** provider
2. Toggle **Enable Google** to ON
3. Paste your Google OAuth credentials:
   - **Client ID:** (from Google Cloud Console)
   - **Client Secret:** (from Google Cloud Console)
4. In the **Redirect URL for Google** section, you'll see Supabase's redirect URL
   - This must match one of your Google OAuth redirect URIs
   - Usually looks like: `https://project-id.supabase.co/auth/v1/callback?provider=google`
5. Go back to Google Cloud Console and add this URL to your authorized redirect URIs if not already there
6. Click **Save** in Supabase

---

## Step 3: Test Locally

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000/login

3. Click "Se connecter avec Google"

4. You should be redirected to Google's login screen

5. After authentication, you'll be redirected to `/auth/callback` and then to `/orientation`

---

## Step 4: Deploy to Vercel

### 4a. Push to GitHub

```bash
git add .
git commit -m "Add Google OAuth authentication"
git push
```

### 4b. Deploy

1. Go to https://vercel.com
2. Import your GitHub repository
3. Vercel will auto-detect Next.js
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (These should auto-populate from your Vercel/Supabase integration)
5. Deploy

### 4c. Update Google OAuth

1. Back in Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add your Vercel domain to authorized redirect URIs:
   ```
   https://your-project.vercel.app/auth/callback
   ```
4. Save

---

## Features Implemented

### Session Persistence
- Sessions are stored in **secure HTTP-only cookies** by Supabase
- Sessions survive browser closes and device reboots
- Automatically synced across tabs/windows

### Cross-Device Login
- Same Google account can be used from any device
- Each device gets its own secure session
- Sessions are independent (logging out on one device doesn't affect others)

### Middleware Protection
- Protected routes: `/orientation`, `/results`, `/historique`
- Unauthenticated users are redirected to `/login`
- Authenticated users trying to access `/login` are redirected to `/orientation`
- Session validation happens on every request

### Real-Time Auth State
- App listens for auth state changes
- User info updates instantly across all components
- Logout clears session and user state

---

## Troubleshooting

### Issue: "Provider not enabled"
**Solution:** Make sure you've enabled Google provider in Supabase Authentication settings.

### Issue: "Redirect URL mismatch"
**Solution:** Ensure the redirect URL in your Google OAuth credentials matches exactly (including protocol and trailing slashes).

### Issue: "Session not persisting"
**Solution:** 
- Check browser cookies are enabled
- Clear browser cookies and try again
- Check that middleware.ts is in the root directory

### Issue: "Getting logged out randomly"
**Solution:**
- Make sure `supabase.auth.getUser()` is called in middleware
- Don't remove the `updateSession` call in middleware.ts

---

## Environment Variables

Your app needs these environment variables (already set in integration):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional, for admin operations)
```

---

## Architecture Overview

```
User clicks "Se connecter avec Google"
        ↓
supabase.auth.signInWithOAuth({ provider: "google" })
        ↓
Redirects to Google OAuth consent screen
        ↓
User approves
        ↓
Google redirects to http://localhost:3000/auth/callback?code=...
        ↓
/auth/callback exchanges code for session
        ↓
Session stored in HTTP-only cookies
        ↓
Middleware validates session on every request
        ↓
Auth context listens for state changes
        ↓
Redirects to /orientation
```

---

## Security Notes

- Tokens are never stored in localStorage
- All tokens are in HTTP-only, secure cookies (can't be accessed by JavaScript)
- Sessions are validated on every request via middleware
- PKCE flow is used automatically by Supabase for extra security
- No sensitive data is stored on the client

---

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Check the server logs for errors
3. Verify all environment variables are set
4. Check that Google OAuth is enabled in Supabase
5. Clear browser cookies and try again
