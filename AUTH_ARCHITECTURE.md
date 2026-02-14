# MonOrienta Authentication Architecture

## Overview

MonOrienta uses **Supabase Google OAuth** for secure, production-grade authentication. Sessions persist across devices and survive browser restarts.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Login Page (/login)                                          │
│  ├─ Click "Se connecter avec Google"                         │
│  └─ Calls signInWithGoogle()                                 │
│                                                               │
│  Auth Context (lib/auth-context.tsx)                         │
│  ├─ Manages user state                                       │
│  ├─ Listens for auth changes via Supabase                   │
│  └─ Provides signInWithGoogle() and logout()                │
│                                                               │
│  Protected Pages (/orientation, /historique, /results)       │
│  └─ Wrapped with auth checks                                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                         ↓↑
                    HTTP + Cookies
                         ↓↑
┌─────────────────────────────────────────────────────────────┐
│                  Edge Network (Vercel)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Middleware (middleware.ts)                                  │
│  ├─ Runs on every request                                    │
│  ├─ Calls updateSession()                                    │
│  ├─ Validates user via getUser()                             │
│  └─ Enforces route protection                                │
│                                                               │
│  Callback Handler (/auth/callback)                           │
│  ├─ Receives authorization code                              │
│  ├─ Exchanges code for session                               │
│  └─ Redirects to /orientation                                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                         ↓↑
                    HTTP + JWT Token
                         ↓↑
┌─────────────────────────────────────────────────────────────┐
│                 Supabase Auth Service                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  OAuth Flow                                                   │
│  ├─ Receives OAuth request                                   │
│  ├─ Redirects to Google OAuth                                │
│  ├─ Receives auth code from Google                           │
│  ├─ Exchanges for Google tokens                              │
│  └─ Creates Supabase session                                 │
│                                                               │
│  Session Store                                               │
│  └─ Stores sessions with TTL                                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                         ↓↑
                    OAuth Protocol
                         ↓↑
┌─────────────────────────────────────────────────────────────┐
│              Google OAuth 2.0 Service                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ├─ OAuth Consent Screen                                     │
│  ├─ Credential Management                                    │
│  └─ Token Management                                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

### 1. Initial Login

```
User at /login
    ↓
Clicks "Se connecter avec Google"
    ↓
handleGoogleSignIn() called
    ↓
supabase.auth.signInWithOAuth({
  provider: "google",
  options: { redirectTo: "http://localhost:3000/auth/callback" }
})
    ↓
Supabase redirects to Google OAuth Consent Screen
    ↓
User approves permissions
    ↓
Google redirects to Supabase
    ↓
Supabase redirects to http://localhost:3000/auth/callback?code=AUTH_CODE
    ↓
Callback handler exchanges code for session
    ↓
Session stored in HTTP-only cookies
    ↓
Redirected to /orientation
    ↓
Auth context detects session via getSession()
    ↓
User state updated in context
    ↓
Protected pages accessible
```

### 2. Session Persistence

```
User closes browser
    ↓
Session cookie persists
    ↓
User reopens app
    ↓
Middleware calls supabase.auth.getUser()
    ↓
Supabase validates session cookie
    ↓
User automatically logged in
    ↓
No need to sign in again
```

### 3. Cross-Device Login

```
User logs in on Device A
    ↓
Supabase creates session
    ↓
Session stored server-side

User opens app on Device B
    ↓
Supabase has no session for Device B yet
    ↓
User must authenticate again
    ↓
User clicks "Se connecter avec Google"
    ↓
Google recognizes user is already signed in
    ↓
Supabase creates new session for Device B
    ↓
User is logged in on Device B
    ↓
Both devices have independent sessions
    ↓
Logging out on Device A doesn't affect Device B
```

### 4. Logout Flow

```
User clicks "Déconnexion"
    ↓
handleLogout() called
    ↓
supabase.auth.signOut()
    ↓
Server-side session invalidated
    ↓
HTTP-only cookie cleared
    ↓
User state cleared in context
    ↓
Redirected to /login
    ↓
On next request, middleware detects no session
    ↓
/login page loads
```

---

## Session Management

### What Gets Stored

**Server-Side (Supabase):**
- Session ID
- User ID
- Refresh token
- Expiration timestamp
- User metadata (email, name, picture)

**Client-Side (HTTP-Only Cookies):**
- Access token (JWT)
- Refresh token (for silent refresh)
- Session info

**Not Stored on Client:**
- Passwords (N/A - OAuth)
- Sensitive user data
- API keys

### Session Lifecycle

1. **Creation:** User authenticates → Supabase creates session
2. **Validation:** Every request → Middleware validates session
3. **Refresh:** Session expires → Supabase issues new session silently
4. **Expiration:** 1 hour of inactivity → Session expires
5. **Cleanup:** User logs out → Session invalidated

### Security Features

- **HTTP-Only Cookies:** Can't be accessed by JavaScript (prevents XSS attacks)
- **Secure Flag:** Cookies only sent over HTTPS
- **SameSite:** Prevents CSRF attacks
- **PKCE Flow:** Authorization code can't be intercepted
- **Token Rotation:** Refresh tokens rotated on use
- **Session Timeout:** Sessions expire after inactivity

---

## File Structure

```
lib/
├── auth-context.tsx          # Auth state management & OAuth
├── supabase/
│   ├── client.ts             # Browser Supabase client
│   ├── server.ts             # Server Supabase client
│   └── middleware.ts         # Session validation & sync
├── utils.ts                  # Utility functions

app/
├── login/
│   └── page.tsx              # Login page with Google button
├── auth/
│   └── callback/
│       └── route.ts          # OAuth callback handler
├── orientation/
│   └── page.tsx              # Protected route example
├── historique/
│   └── page.tsx              # Protected route example
├── results/
│   └── page.tsx              # Protected route example
├── layout.tsx                # App layout with AuthProvider
└── page.tsx                  # Home page

middleware.ts                 # Root middleware for session sync
```

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Public anon key (safe to expose)
SUPABASE_SERVICE_ROLE_KEY         # Admin key (keep secret - optional)
```

These are automatically injected by the Supabase integration.

---

## Key Components

### 1. AuthProvider (lib/auth-context.tsx)

Wraps entire app and provides:
- `user` - Current logged-in user
- `isLoading` - Auth initialization state
- `signInWithGoogle()` - Initiates OAuth
- `logout()` - Clears session and user
- `saveTestResult()` - Saves quiz results
- `getTestHistory()` - Retrieves saved results
- `deleteTestEntry()` - Removes result

### 2. Middleware (middleware.ts)

Runs on every request:
- Initializes Supabase server client
- Validates session via `getUser()`
- Updates session cookies
- Enforces route protection
- Syncs auth state server↔client

### 3. OAuth Callback (app/auth/callback/route.ts)

Handles OAuth redirect:
- Extracts authorization code from URL
- Exchanges code for session token
- Sets session cookies
- Redirects to `/orientation` on success

### 4. Login Page (app/login/page.tsx)

User-facing login UI:
- Google OAuth button
- Error messaging
- Loading state management
- Redirect to home if already logged in

---

## Protected Routes

Routes that require authentication:
- `/orientation` - Orientation quiz
- `/historique` - Quiz history
- `/results` - Quiz results

Unprotected routes:
- `/` - Home page
- `/login` - Login page
- `/auth/callback` - OAuth callback

### Protection Logic

In middleware.ts:
```typescript
const protectedPaths = ['/orientation', '/results', '/historique']
const isProtected = protectedPaths.some(path => 
  request.nextUrl.pathname.startsWith(path)
)

if (isProtected && !user) {
  redirect to /login
}
```

---

## Error Handling

### OAuth Errors

**Provider Not Enabled**
- Error: "provider_not_enabled" or similar
- Fix: Enable Google in Supabase Authentication settings

**Invalid Credentials**
- Error: "invalid_client_id" or "invalid_client_secret"
- Fix: Verify Google OAuth credentials in Supabase

**Redirect URL Mismatch**
- Error: "redirect_uri_mismatch"
- Fix: Ensure callback URL matches Google OAuth settings

### Session Errors

**Session Expired**
- Auto-handled: Supabase silently refreshes
- If fails: User redirected to login

**Session Invalid**
- Cause: Middleware can't validate
- Fix: User is redirected to login

---

## Performance Considerations

1. **Auth Context Initialization:** ~100ms (checks session on mount)
2. **Middleware Processing:** ~50ms (validates on every request)
3. **OAuth Flow:** ~2-3 seconds (depends on network/Google)
4. **Session Refresh:** Automatic, <100ms

### Optimization Tips

- Auth context is created once at app root
- Middleware runs in Edge (faster than serverless)
- Session validation is cached for the request
- OAuth tokens cached in secure cookies

---

## Testing

### Local Testing

1. Start: `npm run dev`
2. Visit: http://localhost:3000/login
3. Click Google button
4. Test flow: login → redirect → protected page
5. Test persistence: refresh page → still logged in
6. Test logout: click logout → redirected to login

### Production Testing

1. Test on vercel domain
2. Test on custom domain (if applicable)
3. Test on mobile browser
4. Test cross-browser
5. Test after 1 hour (session refresh)

---

## Troubleshooting Checklist

- [ ] Google provider enabled in Supabase?
- [ ] Client ID & Secret correct in Supabase?
- [ ] Redirect URL correct in Google OAuth?
- [ ] Environment variables set?
- [ ] Middleware.ts in root directory?
- [ ] Auth cookies enabled in browser?
- [ ] No console errors in DevTools?
- [ ] Supabase service operational?
- [ ] Google OAuth service operational?

---

## References

- Supabase Auth: https://supabase.com/docs/guides/auth
- Google OAuth: https://developers.google.com/identity/protocols
- Next.js Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
- Supabase SSR: https://supabase.com/docs/guides/auth/server-side-rendering
