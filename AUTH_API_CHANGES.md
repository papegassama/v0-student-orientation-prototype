# Authentication API Changes

## useAuth() Hook Changes

### User Object Structure

**Before:**
```typescript
type User = {
  fullName: string
  email: string
}
```

**After:**
```typescript
type User = {
  id: string        // Supabase user ID
  email: string
  name: string | null  // From Google profile (if available)
}
```

### Context Methods

**Removed Methods:**
- `login(email: string, password: string)` → sync method with local storage
- `signup(fullName: string, email: string, password: string)` → sync method with local storage

**New Methods:**
- `signInWithGoogle(): Promise<{ success: boolean; error?: string }>` → async OAuth method

**Updated Methods:**
- `logout(): Promise<void>` → now async, clears Supabase session

**Unchanged:**
- `saveTestResult(...)`
- `getTestHistory()`
- `deleteTestEntry(id)`
- `user` state
- `isLoading` state

## Usage Examples

### Before (Email/Password)
```typescript
const { login } = useAuth()

const handleLogin = (e: React.FormEvent) => {
  const result = login(email, password)
  if (result.success) {
    router.push("/orientation")
  }
}
```

### After (Google OAuth)
```typescript
const { signInWithGoogle } = useAuth()

const handleGoogleSignIn = async () => {
  const result = await signInWithGoogle()
  // Supabase handles redirect automatically
  // On success, redirected to /auth/callback
}
```

### Before (Logout)
```typescript
const { logout } = useAuth()

<Button onClick={() => logout()}>Logout</Button>
```

### After (Logout - Now Async)
```typescript
const { logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push("/login")
}

<Button onClick={handleLogout}>Logout</Button>
```

### User Display
```typescript
// Before
<div>{user.fullName}</div>

// After
<div>{user.name || user.email}</div>
```

## Session Management

### Session Persistence
Sessions are now managed by Supabase via:
- HTTP-only cookies
- Automatic token refresh
- Server-side validation with middleware

### Auth State Changes
The auth context listens for `onAuthStateChange` events:
```typescript
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    setUser({
      id: session.user.id,
      email: session.user.email || "",
      name: session.user.user_metadata?.full_name || null,
    })
  } else {
    setUser(null)
  }
})
```

## Test History

### Key Generation Change
Test history is now keyed by `user.id` instead of `user.email`:

```typescript
// Before
const key = `monorienta_history_${user.email.toLowerCase()}`

// After
const key = `monorienta_history_${user.id}`
```

This prevents issues if users change their email through Google account settings.

## Protected Routes

### Middleware Protection
Routes are now protected at the middleware level:

**Protected routes:**
- `/orientation`
- `/results`
- `/historique`

**Auth redirect:**
- Unauthenticated users trying to access protected routes → `/login`
- Authenticated users visiting `/login` → `/orientation`

## Error Handling

### Google OAuth Errors
```typescript
const result = await signInWithGoogle()

if (!result.success) {
  console.error(result.error)
  // Example errors:
  // - "User denied access"
  // - "OAuth provider error"
  // - "Network error"
}
```

### Session Errors
Handled automatically by Supabase middleware:
- Invalid session → redirected to `/login`
- Session expired → auto-refresh via middleware
- Cookie issues → handled by SSR client

## Migration Checklist for Developers

If modifying auth-dependent code:

- [ ] Replace `login()` calls with `signInWithGoogle()`
- [ ] Make `logout()` calls async
- [ ] Update user display from `user.fullName` to `user.name || user.email`
- [ ] Update test history keys from `email` to `user.id`
- [ ] Add `useRouter` for logout redirects
- [ ] Test on both local and production

## Breaking Changes

⚠️ **Important**: Old localStorage auth data is not compatible
- Old `monorienta_session` data ignored
- Old `monorienta_users` data ignored
- Old `monorienta_history_*` keys will not be used
- Users must log in again via Google

## Backwards Compatibility

None. This is a complete auth system replacement. Users cannot use old credentials.

## Questions?

See `GOOGLE_OAUTH_SETUP.md` for configuration help.
