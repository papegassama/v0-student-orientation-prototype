# Supabase Authentication Setup Checklist

This guide will help you configure Supabase Auth correctly for the MonOrienta prototype.

## Step 1: Enable Email/Password Provider in Supabase

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Click on **Authentication** in the left sidebar
3. Go to **Providers**
4. Find **Email** provider and toggle it **ON**
5. In the Email provider settings, ensure **Email/Password** is enabled

## Step 2: Disable Email Confirmation (for prototype)

1. Still in **Authentication** → **Providers**
2. Click on the **Email** provider to expand options
3. Toggle **Confirm email** to **OFF** (this is under Email auth settings)
4. Or in **Authentication** → **Policies**, set email confirmation to optional
5. Save changes

## Step 3: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add the following redirect URLs:
   - `http://localhost:3000` (for local development)
   - `http://localhost:3000/auth/callback` (if using callback)
   - `https://yourdomain.com` (your production domain)
   - `https://yourdomain.com/auth/callback`

## Step 4: Verify Database Schema

Run the following SQL in your Supabase SQL editor to verify tables exist:

```sql
-- Check user_profiles table
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'user_profiles';

-- Check quiz_results table
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'quiz_results';

-- Check RLS policies are enabled
SELECT * FROM pg_policies 
WHERE tablename = 'user_profiles';
```

## Step 5: Test Authentication Flow

### Test Signup:
1. Open the app in your browser
2. Go to `/signup`
3. Enter:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
4. Click "S'inscrire" (Sign up)
5. Check browser console for any errors
6. You should be redirected to `/orientation`

### Test Login:
1. Go to `/login`
2. Enter:
   - Email: "test@example.com"
   - Password: "password123"
3. Click "Connexion" (Login)
4. Check browser console for errors
5. You should be redirected to `/orientation`

### Test Quiz Saving:
1. Complete a quiz on the `/orientation` page
2. Check browser console for "Quiz results saved successfully"
3. Check Supabase: **SQL Editor** → Run this query:
   ```sql
   SELECT id, user_id, created_at FROM quiz_results LIMIT 10;
   ```

## Step 6: Common Issues & Fixes

### "Email or password incorrect" when signup was successful
- The email confirmation setting is still ON
- Fix: Go to Authentication → Providers → Email, disable confirmation

### "Cannot insert row" or RLS policy errors
- RLS policies are blocking inserts
- Fix: Run the migration scripts in `/scripts/02-fix-rls-policies.sql`

### User profile not created after signup
- The auth user was created but profile insertion failed
- Fix: Check the browser console logs (look for "[v0]" messages)
- Check Supabase: **SQL Editor** → `SELECT * FROM user_profiles;`

### Cannot login after signup
- Session is not being persisted
- Make sure the login page is awaiting the async `login()` function
- Check that Supabase client is using `@supabase/ssr` (server-side rendering)

## Step 7: Testing on Mobile

1. Get your local IP: `ifconfig` (Mac) or `ipconfig` (Windows)
2. Start dev server: `npm run dev`
3. On mobile, go to: `http://YOUR_LOCAL_IP:3000`
4. Test signup and login flows

## Environment Variables to Check

Make sure these are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from Supabase: **Settings** → **API**

## Debugging Tips

### Check browser console:
- Look for "[v0]" prefixed logs
- Check network tab in DevTools → see API responses

### Check Supabase logs:
- Go to your Supabase project
- **Logs** → **Auth logs** to see authentication attempts
- **Logs** → **Database** to see query errors

### Check RLS policies:
```sql
-- View all RLS policies on user_profiles
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Test if insert is allowed (replace user-id)
-- This should succeed if RLS is correct
SELECT COUNT(*) FROM user_profiles 
WHERE id = 'user-id' AND id = auth.uid();
```

## Once Everything Works

After confirming signup, login, and quiz saving work:

1. Re-enable email confirmation if desired: 
   - Authentication → Providers → Email → toggle Confirm email ON
   
2. Add email verification in your signup flow:
   - Check the `data.user?.user_metadata?.email_verified` flag
   
3. Update production secrets in Vercel:
   - Settings → Environment Variables
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

