# Authentication Quick Start Guide

## 5-Minute Setup

### 1. Disable Email Confirmation in Supabase (CRITICAL)

```
https://app.supabase.com → Your Project → Authentication → Providers → Email
```

Toggle **"Confirm email"** OFF

This allows signup and immediate login without email verification.

### 2. Verify Environment Variables

Check your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from: Supabase → Settings → API

### 3. Run Database Migrations

The app automatically creates tables when you first signup. But if you want to manually set them up:

Go to Supabase SQL Editor and copy-paste contents of:
- `/scripts/01-create-schema.sql`
- `/scripts/02-fix-rls-policies.sql`

### 4. Start the App

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### 5. Test the Flow

#### Test Signup:
1. Click "Rejoins-nous!" on the home page
2. Fill in form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
3. Check browser console for `[v0]` messages
4. Should redirect to `/orientation`

#### Test Login:
1. Go to `/login`
2. Enter same email and password
3. Should redirect to `/orientation`

#### Test Quiz:
1. Answer some questions on orientation page
2. Click to see results
3. Go to `/profile` to see saved quiz history

---

## Understanding the Error Messages

### "Email ou mot de passe incorrect"
- Email confirmation is still enabled
- Fix: Turn off email confirmation in Supabase (see step 1 above)

### "Account not found"
- Email exists in auth but not in user_profiles table
- Usually happens if profile creation failed
- Fix: Manually create profile via SQL, or try signup again

### "Network error" or timeout
- Supabase is unreachable
- Fix: Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check internet connection

### "Session expired"
- This is normal, user can just log in again
- On production, can be caused by token rotation

---

## Mobile Testing

### On same WiFi:

1. Get your computer IP:
   - Windows: `ipconfig` (look for "IPv4 Address")
   - Mac: `ifconfig` (look for "inet " under your WiFi connection)

2. Start app: `npm run dev`

3. On mobile, visit: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`

4. Test signup and login

### Via Internet (using ngrok):

1. Install: `npm install -g ngrok`
2. Run: `ngrok http 3000`
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. In Supabase → Authentication → URL Configuration → add this URL
5. On mobile: `https://abc123.ngrok.io`

---

## What Each Feature Does

### `/login`
- Takes email and password
- Calls `supabase.auth.signInWithPassword()`
- Stores session in browser cookies
- Redirects to `/orientation` on success

### `/signup`
- Takes full name, email, password
- Calls `supabase.auth.signUp()`
- Creates row in `user_profiles` table
- Stores session in browser cookies
- Redirects to `/orientation` on success

### `/orientation`
- Shows quiz questions
- Saves responses to `quiz_results` table
- On completion, shows `/results` page

### `/profile`
- Shows all past quiz results for logged-in user
- Can delete individual quiz results
- Shows quiz statistics

### `/api/quiz-results`
- `POST`: Saves new quiz result
- `GET`: Retrieves all quiz results for user

---

## Database Schema (Simple Overview)

```
auth.users (managed by Supabase)
├── id (UUID)
├── email
├── encrypted_password
└── ...

user_profiles
├── id (UUID, foreign key to auth.users)
├── full_name
├── email
└── created_at

quiz_results
├── id (UUID)
├── user_id (foreign key to auth.users)
├── answers (JSON)
├── recommendations (JSON)
└── created_at
```

---

## Checking if Data is Saved

Open Supabase SQL Editor and run:

```sql
-- See all users
SELECT email FROM auth.users LIMIT 10;

-- See all profiles
SELECT full_name, email FROM user_profiles LIMIT 10;

-- See all quiz results
SELECT user_id, created_at FROM quiz_results LIMIT 10;

-- See quiz results for specific user
SELECT * FROM quiz_results 
WHERE user_id = 'user-id-here' 
ORDER BY created_at DESC;
```

---

## Security for Production

Current setup (prototype):
- ✅ Passwords hashed by Supabase
- ✅ RLS policies enforce user data isolation
- ✅ Email confirmation disabled (dev only)

Before going to production:
- Enable email confirmation
- Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` to restricted key
- Use Supabase's `SUPABASE_SERVICE_ROLE_KEY` only on server
- Add rate limiting to auth endpoints
- Enable CAPTCHA on signup

---

## Troubleshooting Quick Links

- Email confirmation on? → Disable in Supabase
- Can't login after signup? → Check user_profiles table
- Quiz results not saving? → Check `/api/quiz-results` logs
- Mobile not working? → Use local IP or ngrok
- Still stuck? → See `TROUBLESHOOTING.md`

