# Quick Reference Card - Authentication Setup

## 🎯 In 60 Seconds

```
1. Supabase: Turn OFF email confirmation
   https://app.supabase.com → Auth → Providers → Email

2. Terminal: npm run dev

3. Browser: http://localhost:3000 → "Rejoins-nous!" → Sign up

4. Should work immediately ✅
```

---

## 🔧 Critical Settings

### Supabase Configuration
```
Authentication → Providers → Email
├─ Email/Password: ON ✓
├─ Confirm email: OFF ✗
└─ Redirect URL: http://localhost:3000
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

---

## 🧪 Quick Tests

### Test 1: Signup
```
URL: http://localhost:3000/signup
Enter: test@example.com / password123
Result: Should redirect to /orientation ✅
```

### Test 2: Login
```
URL: http://localhost:3000/login
Enter: test@example.com / password123
Result: Should log in immediately ✅
```

### Test 3: Quiz
```
1. Answer 3-4 questions on /orientation
2. Click "Voir les résultats"
3. Go to /profile
4. Should see quiz in history ✅
```

---

## 🐛 Debugging

### View Logs
```
Press: F12 (Windows/Linux) or Cmd+Option+J (Mac)
Search for: [v0]
These show: Exact flow and any errors
```

### View Database
```
Supabase Dashboard → SQL Editor

-- Check users
SELECT email FROM auth.users;

-- Check profiles
SELECT full_name, email FROM user_profiles;

-- Check quiz results
SELECT * FROM quiz_results LIMIT 5;
```

---

## ❌ Common Issues

| Issue | Fix |
|-------|-----|
| "Email or password incorrect" on signup | Disable email confirmation in Supabase |
| No [v0] logs in console | Make sure email confirmation is OFF |
| Quiz results don't appear | Check API network tab (should be 201) |
| Mobile won't connect | Use IP address: `http://192.168.1.X:3000` |
| Can't find Supabase settings | Go to: app.supabase.com → Project → Auth → Providers |

---

## 📱 Mobile Testing

### Easy: Same WiFi
```bash
1. Get IP: ipconfig (Windows) or ifconfig (Mac)
2. npm run dev
3. On phone: http://YOUR-IP:3000
```

### Advanced: Remote
```bash
1. npm install -g ngrok
2. ngrok http 3000
3. On phone: https://abc123.ngrok.io
```

---

## 🚀 Files to Know

| File | What It Does |
|------|--------------|
| `/lib/auth-context.tsx` | Authentication logic |
| `/app/login/page.tsx` | Login page |
| `/app/signup/page.tsx` | Signup page |
| `/app/api/quiz-results/route.ts` | Save/get quiz results |

---

## 📚 Documentation Quick Links

**Lost?** Read this first:
- `README_AUTH.md` - Overview (2 min)
- `VISUAL_SETUP_GUIDE.md` - Step-by-step (10 min)

**Need help?**
- `TROUBLESHOOTING.md` - Common issues
- `DOCUMENTATION_INDEX.md` - Navigation guide

**Want details?**
- `GETTING_STARTED_AUTH.md` - Full explanation
- `AUTHENTICATION_FIXES.md` - Technical changes

---

## ✅ Success Checklist

```
☑ Email confirmation OFF in Supabase
☑ Environment variables set
☑ npm run dev starts without errors
☑ Can signup at /signup
☑ Can login at /login
☑ Can see quiz results on /profile
☑ Console shows [v0] logs
☑ Works on mobile
☑ No errors in console (except [v0] logs which are info)
```

---

## 🎯 Error Message Translation

| Error | Meaning | Solution |
|-------|---------|----------|
| "Email ou mot de passe incorrect" | Wrong password | Try again |
| "Le nom complet est requis" | No name entered | Enter your full name |
| "Les mots de passe ne correspondent pas" | Passwords don't match | Make sure they're identical |
| "Impossible de créer le profil" | Database error | Check RLS policies or reload |
| "Une erreur est survenue" | Unexpected error | Check console [v0] logs |
| "Vérifiez votre email..." | Email confirmation needed | Disable in Supabase |

---

## 🔐 What's Secure

- ✅ Passwords hashed (bcrypt by Supabase)
- ✅ Sessions in cookies (secure)
- ✅ User isolation via RLS
- ✅ API routes check auth

---

## 📞 Emergency Fixes

### Email Confirmation Blocking Everything
```
Supabase Dashboard
→ Authentication
→ Providers
→ Email
→ Toggle OFF: "Confirm email"
```

### Can't Find Environment Variables
```
Supabase Dashboard
→ Your Project
→ Settings
→ API
→ Copy URL and Anon Key
→ Add to .env.local
```

### RLS Policies Blocking Inserts
```
Supabase Dashboard
→ SQL Editor
→ Run: /scripts/02-fix-rls-policies.sql
```

### Nothing Works, Start Over
```
1. Delete user: Supabase → Auth → Users → Delete
2. Clear browser cookies: DevTools → Application → Cookies
3. Refresh page
4. Try signup again
```

---

## 📊 Quick Verification

```bash
# Is app running?
Check: http://localhost:3000 loads

# Can signup?
URL: /signup
Action: Create account
Expected: Redirect to /orientation

# Can login?
URL: /login
Action: Use same credentials
Expected: Immediate login

# Data saved?
Supabase: SELECT COUNT(*) FROM auth.users; → Should be 1+
Supabase: SELECT COUNT(*) FROM user_profiles; → Should be 1+
Supabase: SELECT COUNT(*) FROM quiz_results; → Should be 0+ after quiz
```

---

## 🎯 Common Next Questions

**"How do I enable email confirmation?"**
→ See `SUPABASE_AUTH_SETUP.md` Step 2

**"How do I reset a user's password?"**
→ See `SUPABASE_AUTH_SETUP.md` - not implemented yet

**"Can I test without internet?"**
→ Yes, but need Supabase running locally (advanced setup)

**"How do I deploy this?"**
→ Use v0 "Publish" button or push to GitHub

**"Can I add 2FA?"**
→ Yes, through Supabase - see their docs

---

## 💡 Pro Tips

1. **Always check [v0] logs first** - They tell you everything
2. **Email confirmation is the #1 blocker** - Turn it off during dev
3. **Use local IP for mobile** - Easier than ngrok
4. **Restart dev server after env var changes** - npm run dev
5. **Clear cookies if session stuck** - DevTools → Application → Cookies

---

## 🆘 Get Help

1. **Check console** - Look for `[v0]` messages
2. **Check database** - Verify data exists in Supabase
3. **Check docs** - Search DOCUMENTATION_INDEX.md
4. **Check settings** - Verify Supabase auth config
5. **Ask in [v0] logs** - What exactly is failing?

---

## 🚀 You Got This!

- ✅ Everything is already built and tested
- ✅ Just need to turn off email confirmation
- ✅ Should work on first try
- ✅ Check console if any issues
- ✅ All documentation is right here

**Start with: README_AUTH.md**
