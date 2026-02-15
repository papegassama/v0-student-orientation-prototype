# Visual Step-by-Step Setup Guide

## 🎯 Main Goal
Get authentication working so users can signup, login, and save quiz results.

---

## Step 1: Disable Email Confirmation (CRITICAL)

### Location in Supabase Dashboard
```
┌─ https://app.supabase.com ─────────────────────┐
│                                                  │
│  Project dropdown ▼  [Your Project Selected]   │
│                                                  │
│  LEFT SIDEBAR:                                   │
│  ├─ Home                                         │
│  ├─ SQL Editor                                   │
│  ├─ Authentication      👈 Click here            │
│  ├─ Database            │                        │
│  └─ Settings            │                        │
│                                                  │
│  MAIN AREA (after clicking Authentication):    │
│  ├─ Users                                        │
│  ├─ Policies                                     │
│  └─ Providers            👈 Click here           │
│      ├─ Email             👈 Click here          │
│      │   Name: Email                             │
│      │   Confirm email: [Toggle] 👈 Turn OFF    │
│      │   ✅ ON  ❌ OFF                           │
│      │                                           │
│      │   ☑️ Confirm email                        │
│      │   └─ Check this box                       │
│      │      ☑️ Require email verification       │
│      │                                           │
│      └─ Need to find these toggles              │
```

### What You're Looking For
```
Providers > Email > Email auth options

Find:
□ Confirm email  <- UNCHECK THIS
```

### After You Disable It
```
✅ Users can now signup instantly
✅ No need to click confirmation link
✅ Can login right after signup
```

---

## Step 2: Start the App

### Open Terminal
```bash
$ cd path/to/project
$ npm install     # (if first time)
$ npm run dev
```

### Expected Output
```
> monorienta@1.0.0 dev
> next dev

  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  
✓ Ready in 2.3s
```

---

## Step 3: Test Signup

### Navigate to Signup Page
```
http://localhost:3000
         ↓
Click "Rejoins-nous!" button
         ↓
/signup page loads
```

### Fill the Form
```
┌─────────────────────────────────┐
│ Rejoins-nous !                  │
├─────────────────────────────────┤
│                                 │
│ Nom complet                     │
│ [________________]              │
│  Enter: "John Doe"              │
│                                 │
│ Email                           │
│ [________________]              │
│  Enter: "john@example.com"      │
│                                 │
│ Mot de passe                    │
│ [________________]              │
│  Enter: "password123"           │
│                                 │
│ Confirmer mot de passe          │
│ [________________]              │
│  Enter: "password123"           │
│                                 │
│     [S'inscrire]                │
│                                 │
└─────────────────────────────────┘
```

### Check Browser Console
```
Press: F12 (or Ctrl+Shift+I on Windows/Linux)
       Cmd+Option+J on Mac

Look for messages starting with [v0]:

✅ [v0] Signup attempt for: john@example.com
✅ [v0] User created: abc-123-def-456
✅ [v0] Login successful, redirecting to orientation
```

### What Should Happen
```
1. Click "S'inscrire"
2. Page shows loading state
3. Console shows [v0] logs
4. ✅ Redirects to /orientation page
```

---

## Step 4: Test Login

### Navigate to Login Page
```
http://localhost:3000/login
```

### Fill the Form
```
┌─────────────────────────────────┐
│ Content de te revoir !          │
├─────────────────────────────────┤
│                                 │
│ Email                           │
│ [________________]              │
│  Enter: "john@example.com"      │
│                                 │
│ Mot de passe                    │
│ [________________]              │
│  Enter: "password123"           │
│                                 │
│     [Connexion]                 │
│                                 │
└─────────────────────────────────┘
```

### Check Console Again
```
✅ [v0] Login attempt for: john@example.com
✅ [v0] Login successful for: john@example.com
✅ [v0] Login successful, redirecting to orientation
```

### What Should Happen
```
✅ Should log in immediately
✅ Should redirect to /orientation
✅ No email confirmation needed
```

---

## Step 5: Verify in Supabase

### Check User Was Created
```
Supabase Dashboard:
→ Authentication
→ Users

Look for: john@example.com in the list ✅
```

### Check Profile Was Created
```
Supabase Dashboard:
→ SQL Editor

Paste this query:
SELECT full_name, email FROM user_profiles;

Expected result:
full_name  | email
───────────┼──────────────────
John Doe   | john@example.com ✅
```

---

## Step 6: Test Quiz Saving

### Complete a Quiz
```
1. On /orientation page, answer 3-4 questions
2. Click "Voir les résultats" button
3. Page shows your recommendations
4. Check console for: [v0] POST quiz-results: Saving...
```

### Verify Data Was Saved
```
Supabase SQL Editor:

SELECT id, user_id, created_at FROM quiz_results LIMIT 5;

Expected result:
id  | user_id | created_at
────┼─────────┼───────────
123 | abc-... | 2024-01-15 10:30:45 ✅
```

---

## Step 7: Mobile Testing

### Option A: Same WiFi (Easiest)

```
Step 1: Find Your Computer IP
─────────────────────────────
Windows:
  Open CMD
  Type: ipconfig
  Look for: "IPv4 Address: 192.168.1.X"

Mac:
  Open Terminal
  Type: ifconfig
  Look for: "inet 192.168.1.X"

Step 2: Start App on Computer
─────────────────────────────
npm run dev

Step 3: On Your Phone
─────────────────────────────
Open browser
Go to: http://192.168.1.X:3000
(Replace X with your actual number)

Step 4: Test Signup
─────────────────────────────
Follow same steps as on desktop
Should work exactly the same ✅
```

### Option B: Remote Testing with ngrok

```
Step 1: Install ngrok
─────────────────────────────
npm install -g ngrok

Step 2: Create Tunnel
─────────────────────────────
npm run dev
(in another terminal:)
ngrok http 3000

You'll see:
Forwarding    https://abc123.ngrok.io -> http://localhost:3000

Step 3: Add to Supabase
─────────────────────────────
Supabase Dashboard:
→ Authentication
→ URL Configuration
→ Add: https://abc123.ngrok.io

Step 4: On Your Phone
─────────────────────────────
Open browser
Go to: https://abc123.ngrok.io
(The same URL from ngrok)

Step 5: Test
─────────────────────────────
Sign up / login like normal ✅
```

---

## Troubleshooting Flowchart

```
Does signup show "Email or password incorrect"?
├─ YES → Go to Supabase → Disable email confirmation
└─ NO → Continue ▼

Does login work immediately after signup?
├─ YES → Great! Continue ▼
└─ NO → Check console for [v0] errors ▼

Can you see quiz results on profile page?
├─ YES → Everything works! ✅
└─ NO → Check /api/quiz-results in Network tab

Check Network Tab:
├─ 200/201 response → RLS policies issue
├─ 401 response → User not authenticated
└─ 500 response → Server error, check console

Still stuck?
└─ → See TROUBLESHOOTING.md
```

---

## Desktop Console (F12) - What You'll See

```
Browser Console Output:

[v0] Signup attempt for: test@example.com
[v0] User created: 123e4567-e89b-12d3-a456-426614174000
[v0] Profile creation successful
[v0] Signup successful, redirecting to orientation
[v0] Login attempt for: test@example.com
[v0] Login successful for: test@example.com
[v0] Login successful, redirecting to orientation
[v0] POST quiz-results: Saving for user 123e4567-e89b-12d3-a456-426614174000
[v0] POST quiz-results: Successfully saved
[v0] GET quiz-results: Fetching for user 123e4567-e89b-12d3-a456-426614174000
[v0] GET quiz-results: Found 1 results
```

---

## Success Checklist

```
✅ Email confirmation disabled in Supabase
✅ Environment variables set (SUPABASE_URL, ANON_KEY)
✅ npm run dev starts the app
✅ Can navigate to /signup
✅ Can create account with signup form
✅ See [v0] logs in console during signup
✅ Redirected to /orientation after signup
✅ Can login immediately with same credentials
✅ Can see user in Supabase → Authentication → Users
✅ Can see profile in database: SELECT * FROM user_profiles
✅ Can complete quiz and see results
✅ Results saved in database: SELECT * FROM quiz_results
✅ Results appear on /profile page
✅ Can delete quiz results
✅ Works on mobile phone
✅ Ready for production! 🚀
```

---

## Common Issues Visual Guide

### Issue 1: Email Confirmation Still On
```
What happens:
  User tries to signup
  ▼
  Gets redirected to success page
  ▼
  Tries to login
  ▼
  Error: "Email ou mot de passe incorrect"
  ▼
  But email WAS in confirmation email!

Solution:
  Supabase Dashboard
  → Authentication
  → Providers
  → Email
  → Toggle OFF: "Confirm email"
```

### Issue 2: Profile Not Created
```
What happens:
  User created in auth.users ✅
  ▼
  But user_profiles row not created ❌
  ▼
  Login fails: "Profil utilisateur non trouvé"

Solution:
  Check browser console for RLS error
  ▼
  Run: /scripts/02-fix-rls-policies.sql
  ▼
  Try signup again
```

### Issue 3: Mobile Won't Connect
```
What happens:
  Phone can't reach http://localhost:3000
  (localhost only works on that computer)

Solution:
  Use computer IP instead:
  Windows CMD: ipconfig
  Mac Terminal: ifconfig
  ▼
  Use IP like: http://192.168.1.100:3000
```

---

## Architecture Diagram

```
                 USER'S BROWSER
                ┌──────────────┐
                │ Signup Form  │
                └──────┬───────┘
                       │ (submit email/password)
                       ▼
            ┌──────────────────────┐
            │  Auth Context       │
            │  (lib/auth-context) │
            └──────┬───────────────┘
                   │ (call Supabase SDK)
                   ▼
       ┌───────────────────────────────────┐
       │   SUPABASE CLOUD (Auth Service)  │
       │  - Hash password                  │
       │  - Create auth.users row          │
       │  - Return session token           │
       └────┬────────────────────────────┬─┘
            │ (user_id)                  │ (session token)
            ▼                            ▼
       ┌─────────────────┐      ┌──────────────────┐
       │ user_profiles   │      │ Browser Cookies  │
       │ table           │      │ (secure HTTP)    │
       │                 │      │                  │
       │ id              │      │ sb-auth-token    │
       │ full_name       │      │ (auto-sent with  │
       │ email           │      │  API requests)   │
       └────┬────────────┘      └──────┬───────────┘
            │                          │
            └──────────────┬───────────┘
                           ▼
            ┌────────────────────────┐
            │ /api/quiz-results      │
            │ (saves quiz data)      │
            │                        │
            │ 1. Checks auth token   │
            │ 2. Gets user_id        │
            │ 3. Saves quiz_results  │
            │    with user_id        │
            │ 4. RLS ensures user    │
            │    can only see own    │
            │    results             │
            └────────────────────────┘
```

---

**Follow these steps in order and you'll have working authentication! 🎉**
