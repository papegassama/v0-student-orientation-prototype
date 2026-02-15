# MonOrienta Authentication Troubleshooting Guide

## Quick Test

Open browser DevTools (F12) and check the **Console** tab for messages starting with `[v0]`.

These logs will tell you exactly what's happening at each step of authentication.

## Common Issues & Solutions

### Issue 1: "Email or password incorrect" on both login and signup

**Cause:** Email confirmation is enabled in Supabase

**Solution:**
1. Go to https://app.supabase.com → Your Project
2. Click **Authentication** → **Providers**
3. Click the **Email** provider
4. Look for **Confirm email** setting
5. Toggle it **OFF**
6. Try signup again

**Expected result:** After signup, you should be able to log in immediately without email confirmation

---

### Issue 2: Signup works, but login doesn't work

**Cause:** The user_profiles table wasn't created, or RLS policies are blocking reads

**Solution:**
1. Open Supabase SQL Editor
2. Run this query:
   ```sql
   SELECT id, full_name, email FROM user_profiles LIMIT 5;
   ```
3. If you see your user in results, the profile exists
4. Check the console for RLS errors like "new row violates row-level security policy"
5. If RLS error appears, run: `/scripts/02-fix-rls-policies.sql` in SQL Editor

---

### Issue 3: Error message: "Profil utilisateur non trouvé" (User profile not found)

**Cause:** User was created in auth.users but profile wasn't inserted

**Solution:**

1. Check if the user exists in auth.users:
   - Supabase Dashboard → **Authentication** → **Users**
   - Look for your test email

2. If user exists, manually create the profile:
   ```sql
   -- Replace YOUR_USER_ID with the actual ID from auth.users
   INSERT INTO user_profiles (id, full_name, email) 
   VALUES ('YOUR_USER_ID', 'Test User', 'test@example.com');
   ```

3. Try logging in again

---

### Issue 4: Page keeps showing loading spinner or redirects back to login

**Cause:** Session isn't being established properly

**Solution:**

1. Check browser console for errors
2. Check if Supabase cookies are being set:
   - DevTools → **Application** → **Cookies**
   - Should see cookie like `sb-<project-id>-auth-token`

3. Try completely clearing cookies and trying signup again:
   - DevTools → **Application** → **Cookies**
   - Delete all cookies for localhost
   - Refresh page
   - Try signup flow again

---

### Issue 5: Works on desktop but not on mobile

**Cause:** Mobile browser using different session storage or cookies blocked

**Solution:**

1. **Check if cookies are allowed on mobile:**
   - Open Settings → Safari (or your browser)
   - Make sure "Block All Cookies" is OFF

2. **Check console logs on mobile:**
   - Use remote debugging via Chrome: `chrome://inspect` on desktop while mobile is connected via USB
   - Or use Safari Web Inspector if on iOS

3. **Make sure localhost:3000 is accessible:**
   - On mobile, use your computer's local IP instead: `http://192.168.1.X:3000`
   - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac)
   - Make sure mobile is on same WiFi network

4. **Test with Ngrok:**
   - Install ngrok: `npm install -g ngrok`
   - Run: `ngrok http 3000`
   - Use the HTTPS URL on mobile
   - Update Supabase **Authentication** → **URL Configuration** with the ngrok URL

---

### Issue 6: CORS errors in browser console

**Cause:** Supabase domain not allowed

**Solution:**

1. Go to Supabase → **Authentication** → **URL Configuration**
2. Add your domain:
   - `http://localhost:3000`
   - `http://192.168.1.X:3000` (your local IP for mobile testing)
   - Your production domain

3. Make sure `NEXT_PUBLIC_SUPABASE_URL` env var is correct

---

### Issue 7: Cannot see quiz results after completing quiz

**Cause:** Quiz results API is failing silently

**Solution:**

1. Check browser console for "[v0]" logs while completing quiz
2. Should see: `[v0] Saving quiz results for user: <user-id>`
3. If not seeing logs, check:
   - Network tab → find `POST /api/quiz-results` request
   - Check the response status (should be 201)
   - If 401, user isn't authenticated

4. Manually verify data was saved:
   ```sql
   SELECT id, user_id, created_at FROM quiz_results 
   ORDER BY created_at DESC LIMIT 10;
   ```

---

## Deep Debugging

### Enable verbose logging in auth context:

Edit `/lib/auth-context.tsx` and change:
```typescript
console.log("[v0]", message) // Already in place
```

These logs are already there! Look for `[v0]` in your browser console.

### Check database connection:

Open Supabase SQL Editor and run:
```sql
-- Test the connection
SELECT NOW();

-- Check user count
SELECT COUNT(*) FROM auth.users;

-- Check profiles
SELECT COUNT(*) FROM user_profiles;

-- Check quiz results
SELECT COUNT(*) FROM quiz_results;
```

### Test user creation directly:

```sql
-- Create a test user (this bypasses the auth system)
-- WARNING: Only do this for testing!
INSERT INTO user_profiles (id, full_name, email) 
VALUES ('test-user-id', 'Test User', 'test@example.com');
```

Then use this ID to test queries.

---

## Performance & Testing Checklist

- [ ] Signup creates user in auth.users (check in Supabase Auth → Users)
- [ ] Signup creates profile in user_profiles table
- [ ] Login retrieves user and profile correctly
- [ ] Quiz completion saves results to quiz_results table
- [ ] Quiz history loads and displays all previous quizzes
- [ ] Delete quiz result removes it from database
- [ ] Works on Chrome desktop
- [ ] Works on Safari mobile
- [ ] Works on Firefox desktop
- [ ] Works on Chrome mobile

---

## Getting Help

If stuck:

1. **Check all console logs** - Look for `[v0]` messages
2. **Check Supabase dashboard:**
   - Auth → Users (see if user was created)
   - SQL Editor → Run select queries to verify data
   - Logs → Auth logs (see all auth attempts)
3. **Check network tab** - See API responses and status codes
4. **Try incognito/private mode** - Rules out cookie issues
5. **Clear all data:**
   - Delete user from Supabase Auth → Users
   - Delete profile: `DELETE FROM user_profiles WHERE email = 'test@example.com';`
   - Try signup flow from scratch

---

## Contact & Support

For issues, check:
1. This troubleshooting guide
2. Supabase documentation: https://supabase.com/docs/guides/auth
3. Next.js documentation: https://nextjs.org/docs
4. Your browser's developer console (`F12`)
