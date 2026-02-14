# MonOrienta Google OAuth - Deployment Checklist

## Before Going Live

Use this checklist to ensure your Google OAuth setup is complete and working properly.

---

## Phase 1: Google Cloud Console Setup

- [ ] Created a new Google Cloud project
- [ ] Enabled Google+ API
- [ ] Created OAuth 2.0 Client ID credentials
- [ ] Added authorized redirect URIs:
  - [ ] `http://localhost:3000/auth/callback` (local testing)
  - [ ] `https://your-vercel-domain.vercel.app/auth/callback` (production)
- [ ] Copied Client ID
- [ ] Copied Client Secret

---

## Phase 2: Supabase Configuration

- [ ] Opened Supabase Dashboard
- [ ] Navigated to Authentication → Providers
- [ ] Enabled Google provider
- [ ] Pasted Client ID in Supabase
- [ ] Pasted Client Secret in Supabase
- [ ] Copied Supabase's redirect URL
- [ ] Added Supabase redirect URL to Google OAuth authorized URIs
- [ ] Clicked Save

---

## Phase 3: Local Testing

- [ ] Installed dependencies: `npm install` or `pnpm install`
- [ ] Created `.env.local` with Supabase credentials (auto-populated if using integration)
- [ ] Started dev server: `npm run dev`
- [ ] Navigated to http://localhost:3000/login
- [ ] Clicked "Se connecter avec Google"
- [ ] Successfully authenticated with Google
- [ ] Redirected to `/orientation`
- [ ] User name/email displays correctly
- [ ] Can access `/historique` and `/results`
- [ ] Logout button works and redirects to login
- [ ] Session persists on page refresh
- [ ] Session works across browser tabs

---

## Phase 4: Vercel Deployment

- [ ] Committed code to GitHub
- [ ] Pushed to main branch
- [ ] Deployed to Vercel (auto or manual)
- [ ] Vercel environment variables are set:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY (if needed)

---

## Phase 5: Production Testing

- [ ] Tested on your Vercel domain: `https://your-project.vercel.app/login`
- [ ] Google OAuth button appears
- [ ] Successfully authenticated with Google
- [ ] Redirected to `/orientation`
- [ ] User data persists
- [ ] Can navigate all protected routes
- [ ] Logout works correctly
- [ ] Tested on mobile device
- [ ] Tested on different browser
- [ ] Tested cross-browser session sync

---

## Phase 6: Google OAuth Credentials Update (Production)

- [ ] Updated Google OAuth redirect URI to production domain:
  ```
  https://your-custom-domain.com/auth/callback
  ```
- [ ] Updated Supabase redirect URI if custom domain is used
- [ ] Tested production domain auth flow

---

## Phase 7: Documentation & Team

- [ ] Read through `SETUP_GOOGLE_OAUTH.md`
- [ ] Shared setup guide with team members
- [ ] Documented any custom configuration
- [ ] Saved Google OAuth Client ID and Secret securely
- [ ] Created recovery procedures if secrets are compromised

---

## Common Issues & Solutions

### Google OAuth not appearing
- [ ] Check that Google provider is enabled in Supabase
- [ ] Verify Supabase credentials are correct
- [ ] Check browser console for errors (F12 → Console tab)
- [ ] Clear browser cache and cookies

### "Redirect URL mismatch" error
- [ ] Verify the exact redirect URL in Google Cloud Console
- [ ] Check for trailing slashes or protocol mismatches
- [ ] Ensure it exactly matches what Supabase provides
- [ ] Update both Google Cloud AND Supabase if needed

### Session not persisting
- [ ] Check browser cookies are enabled
- [ ] Look for console errors in F12
- [ ] Verify middleware.ts exists in project root
- [ ] Check that updateSession is being called
- [ ] Clear all cookies and try again

### Can't login on deployed app
- [ ] Verify production redirect URL is in Google OAuth
- [ ] Check Vercel environment variables
- [ ] Check Vercel build logs for errors
- [ ] Verify Supabase project is same in dev and prod
- [ ] Check browser console for specific errors

---

## Going Live - Final Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Session persistence confirmed
- [ ] Cross-device login tested
- [ ] Performance acceptable
- [ ] Error messages are user-friendly
- [ ] Mobile experience tested
- [ ] Accessibility checked (keyboard navigation)
- [ ] Logged out properly
- [ ] Rate limiting configured (if needed)

---

## Monitoring

After deployment, monitor:

- [ ] Check Supabase authentication logs for errors
- [ ] Monitor Vercel build logs
- [ ] Check for unusual authentication failures
- [ ] Monitor cross-browser compatibility issues
- [ ] Track user feedback about login experience

---

## Quick Reference

**Local Testing URL:** http://localhost:3000/login

**Production URL:** https://your-domain.com/login

**Supabase Dashboard:** https://app.supabase.com/

**Google Cloud Console:** https://console.cloud.google.com/

**Vercel Dashboard:** https://vercel.com/

---

## Support Contacts

- Supabase Docs: https://supabase.com/docs/guides/auth
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- Next.js Auth: https://nextjs.org/docs/app/building-your-application/routing/middleware
