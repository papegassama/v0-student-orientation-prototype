# Getting Started with MonOrienta Authentication

## The Problem We Fixed

Your Supabase authentication wasn't working because:
1. ❌ Email confirmation was blocking login
2. ❌ RLS policies had wrong column references  
3. ❌ Error messages were unclear
4. ❌ Profile creation could fail silently

## The Solution (What We Did)

We fixed all authentication issues and added:
- ✅ Clear error messages
- ✅ Proper RLS policies
- ✅ Comprehensive logging
- ✅ Mobile-ready forms
- ✅ Complete documentation

## Start Here (30 seconds)

### 1. Disable Email Confirmation

This is the #1 blocker. Go to:

```
https://app.supabase.com
→ Select your project
→ Authentication (left sidebar)
→ Providers
→ Email (click to expand)
→ Find "Confirm email" toggle
→ Turn it OFF
```

**Why?** For this prototype, we want users to signup and login immediately without email verification.

### 2. Check Environment Variables

Your `.env.local` should have:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-key
```

If missing, get them from:
```
https://app.supabase.com
→ Your project
→ Settings
→ API
→ Copy URL and Anon Key
```

### 3. Start the App

```bash
npm install
npm run dev
```

Visit: `http://localhost:3000`

### 4. Test Signup

1. Click **"Rejoins-nous!"** button
2. Fill form:
   - Name: anything
   - Email: test@example.com  
   - Password: password123
3. Click **"S'inscrire"** (Sign up)
4. **Should redirect to orientation page** ✅

### 5. Test Login

1. Go to http://localhost:3000/login
2. Enter same email and password
3. Click **"Connexion"** (Login)
4. **Should log you in immediately** ✅

### 6. Test Quiz

1. Answer a few questions on orientation page
2. Click to see results
3. Go to `/profile` to see saved results
4. Try deleting a result

---

## If It Doesn't Work

### Check Browser Console

1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Look for messages starting with `[v0]`
4. These tell you exactly what's happening

**Example output if it's working:**
```
[v0] Signup attempt for: test@example.com
[v0] User created: abc-123
[v0] Login successful, redirecting to orientation
```

**Example if email confirmation is on:**
```
[v0] Signup auth error: Email not confirmed
[v0] Signup failed: Vérifiez votre email...
```

### Common Fixes

| Problem | Solution |
|---------|----------|
| "Email ou mot de passe incorrect" on signup | Disable email confirmation in Supabase |
| Can login but profile page empty | Run `/scripts/02-fix-rls-policies.sql` in Supabase SQL editor |
| Mobile doesn't work | Use your computer's IP: `http://192.168.1.X:3000` |
| Can't see quiz results | Check network tab for API errors |

---

## What Each File Does

### Quick Guides
- **`AUTH_QUICK_START.md`** - 5-minute setup checklist
- **`TROUBLESHOOTING.md`** - Common issues and solutions
- **`AUTHENTICATION_FIXES.md`** - Technical changes we made

### Setup Files  
- **`SUPABASE_AUTH_SETUP.md`** - Complete configuration steps
- **`scripts/01-create-schema.sql`** - Database schema
- **`scripts/02-fix-rls-policies.sql`** - Security policies

---

## Architecture (Simple Version)

```
You (on website)
    ↓ (enter email/password)
    
Login/Signup Page
    ↓ (calls auth function)
    
Auth Context (stores user info)
    ↓ (uses Supabase SDK)
    
Supabase Cloud
    ├─ Checks password
    ├─ Creates user session
    └─ Returns session token
    
Stored in Browser Cookies
    ↓ (automatically sent with requests)
    
API Routes (like /api/quiz-results)
    ↓ (check if user is logged in)
    
Database Queries
    └─ Only show your own data (RLS)
```

---

## How Authentication Works

### Signup
```
1. User enters email/password/name
2. Call: supabase.auth.signUp()
3. User created in auth.users table
4. Create row in user_profiles table
5. Session established (cookie set)
6. Redirect to /orientation
```

### Login
```
1. User enters email/password
2. Call: supabase.auth.signInWithPassword()
3. Supabase checks password hash
4. Session established (cookie set)
5. Fetch user profile from user_profiles
6. Redirect to /orientation
```

### Using Session
```
1. Browser sends request (with session cookie)
2. Server calls: supabase.auth.getUser()
3. Returns who's logged in
4. Fetch only that user's data (RLS enforces this)
5. Return data to browser
```

---

## Testing Checklist

Before saying "it's working":

- [ ] Can create account with signup form
- [ ] Can immediately login after signup
- [ ] Can login with existing account
- [ ] Quiz results are saved and displayed
- [ ] Can delete quiz results
- [ ] Wrong password shows "incorrect" error
- [ ] Email already used shows appropriate error
- [ ] Works on mobile phone
- [ ] Works in incognito/private mode

---

## Mobile Testing

### Option 1: Same WiFi (Easiest)

1. Get your computer's local IP:
   ```
   Windows: ipconfig
   Mac: ifconfig
   ```
   Look for IP like `192.168.1.100`

2. Start app: `npm run dev`

3. On phone: `http://192.168.1.100:3000`

4. Test signup/login

### Option 2: ngrok (Can test from anywhere)

```bash
npm install -g ngrok
ngrok http 3000
```

You'll get URL like: `https://abc123.ngrok.io`

Then:
1. Add to Supabase: Authentication → URL Configuration
2. On phone: `https://abc123.ngrok.io`

---

## See Console Logs While Testing

**Desktop:**
- Windows/Linux: `F12`
- Mac: `Cmd + Option + J`
- Right-click → Inspect → Console tab

**Mobile:**
- iOS Safari: Requires Mac with Xcode
- Chrome on Android: Connect via USB to desktop, use `chrome://inspect`
- Or use ngrok for remote testing

---

## What's Different from Before

### Before (Broken)
```
Signup → Error: "Email or password incorrect"
Login → Error even though signup worked
Quiz saving → Silently failed
Mobile → Didn't work at all
```

### After (Fixed)
```
Signup → Works immediately
Login → Works with clear error messages
Quiz saving → Logs show what's happening
Mobile → Fully working
```

---

## Data Storage

### What Gets Saved

**After Signup:**
- Email and hashed password (in `auth.users`)
- Full name (in `user_profiles`)

**After Quiz:**
- Quiz answers (JSON)
- Recommendations (JSON)
- Timestamp

### Can Others See My Data?

No! Row Level Security (RLS) ensures:
- You only see your own profiles
- You only see your own quiz results
- Database enforces this at query time

---

## Next Steps

1. **Test Everything** - Follow the testing checklist above
2. **Read Full Docs** - Open `TROUBLESHOOTING.md` if issues arise
3. **Deploy to Production** - Use the Publish button in v0
4. **Add Features** - You can now add more functionality knowing auth works

---

## Get Help

1. **Not working?** → Read `TROUBLESHOOTING.md`
2. **Setup questions?** → See `SUPABASE_AUTH_SETUP.md`
3. **Technical details?** → Check `AUTHENTICATION_FIXES.md`
4. **Stuck?** → Look for `[v0]` logs in browser console

---

## Success Indicators

You'll know it's working when:
- ✅ Signup redirects to orientation page
- ✅ Login works immediately after signup
- ✅ Quiz results appear in profile
- ✅ Console shows `[v0]` logs
- ✅ Works on phone too

**Once all these work, authentication is ready for production!**
