# Google OAuth Setup Guide for MonOrienta

## Step 1: Configure Google OAuth in Supabase

### In Supabase Console:
1. Navigate to **Authentication → Providers**
2. Find and click on **Google**
3. Enable the provider
4. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console

### Setting Redirect URLs:
Add these URLs in your Supabase provider settings:
- **Development**: `http://localhost:3000/auth/callback`
- **Production**: `https://your-domain.com/auth/callback`

## Step 2: Get Google OAuth Credentials

### From Google Cloud Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Type: **Web application**
   - Authorized redirect URIs:
     - `https://[your-project].supabase.co/auth/v1/callback?provider=google`
     - `http://localhost:3000/auth/callback`
     - `https://your-domain.com/auth/callback`
5. Copy **Client ID** and **Client Secret**
6. Paste them into Supabase provider settings

## Step 3: Test Locally

```bash
npm run dev
```

Then:
1. Navigate to `http://localhost:3000/login`
2. Click "Se connecter avec Google"
3. Complete Google authentication
4. Should redirect to `/orientation`
5. Test history should work per user

## Step 4: Deploy to Production

Once tested locally:
1. Update your production domain in Google Console
2. Update redirect URL in Supabase for production domain
3. Deploy to Vercel
4. Test with production domain

## Troubleshooting

### "OAuth callback failed"
- Check redirect URLs match exactly in both Google Console and Supabase
- Ensure Google OAuth is enabled in Supabase
- Verify Client ID and Secret are correct

### "User not authenticated"
- Clear browser cookies
- Check middleware.ts is properly configured
- Ensure `/auth/callback` route exists

### "Test history not saving"
- Check user is properly authenticated (check `useAuth()` hook)
- Verify localStorage is not blocked
- Check browser console for errors

## Environment Variables

These are already configured via Supabase integration:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

No additional environment variables needed!

## Security Notes

- Google handles password security
- Supabase manages session tokens
- No sensitive data stored locally
- Cookies are HTTP-only and secure
- CSRF protection enabled by default

## User Flow

1. User visits `/login`
2. Clicks "Se connecter avec Google"
3. Redirected to Google login
4. Redirected back to `/auth/callback`
5. Session created in Supabase
6. User redirected to `/orientation`
7. Can access protected routes
8. Click logout → clears Supabase session

That's it! Your OAuth implementation is complete.
