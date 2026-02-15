# MonOrienta - Supabase Authentication Setup

## 🚀 Quick Start (2 Minutes)

### Step 1: Disable Email Confirmation
```
https://app.supabase.com → Your Project → Authentication → Providers → Email
Toggle OFF: "Confirm email"
```

### Step 2: Start the App
```bash
npm install
npm run dev
```

### Step 3: Test
- Go to http://localhost:3000
- Click "Rejoins-nous!" to signup
- Test with: test@example.com / password123
- Should redirect to orientation page ✅

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **GETTING_STARTED_AUTH.md** | Start here - simple walkthrough |
| **AUTH_QUICK_START.md** | 5-minute setup checklist |
| **SUPABASE_AUTH_SETUP.md** | Detailed configuration steps |
| **TROUBLESHOOTING.md** | Common issues and fixes |
| **AUTHENTICATION_FIXES.md** | Technical details of what we fixed |

---

## 🔧 What We Fixed

1. **Auth Context** - Fixed column references and error handling
2. **Login/Signup Pages** - Added clear error messages and logging
3. **API Routes** - Added comprehensive error logging
4. **Database Schema** - Fixed RLS policies
5. **Documentation** - Created complete guides

---

## ✅ Test Authentication

### Signup Flow
```
1. Go to http://localhost:3000/signup
2. Enter: email, password, full name
3. Should redirect to /orientation
✅ If this works, auth is configured correctly
```

### Login Flow  
```
1. Go to http://localhost:3000/login
2. Use same email and password from signup
3. Should redirect to /orientation immediately
✅ If this works, sessions are working
```

### Mobile Testing
```
1. Find your local IP: ipconfig (Windows) or ifconfig (Mac)
2. Start app: npm run dev
3. On phone: http://192.168.1.X:3000 (your IP)
4. Test signup and login
✅ If this works, mobile is ready
```

---

## 🐛 Debug Logging

Open browser console (F12) and look for `[v0]` messages:

```javascript
[v0] Signup attempt for: test@example.com
[v0] User created: abc-123-def
[v0] Login successful, redirecting to orientation
```

These logs tell you exactly what's happening at each step.

---

## ❌ Common Issues

| Issue | Solution |
|-------|----------|
| "Email or password incorrect" on signup | Disable email confirmation in Supabase |
| Can't login after signup works | Check `/profile` page - user was created but profile might be missing |
| Mobile doesn't work | Use your computer's local IP instead of localhost |
| Quiz results don't save | Check network tab in DevTools for API errors |

**See `TROUBLESHOOTING.md` for detailed solutions.**

---

## 📋 Checklist

- [ ] Email confirmation disabled in Supabase
- [ ] Environment variables set (SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] Can signup successfully
- [ ] Can login immediately after signup
- [ ] Can complete quiz and see results
- [ ] Can access /profile page
- [ ] Works on mobile device

---

## 🚢 Ready for Production?

Before deploying:

1. ✅ Test all flows locally (see checklist above)
2. ✅ Read `SUPABASE_AUTH_SETUP.md` step 7 (Production)
3. ✅ Update environment variables in Vercel
4. ✅ Enable email confirmation if needed
5. ✅ Add password reset flow
6. ✅ Review security settings

---

## 🔐 Security Features

- ✅ Passwords hashed by Supabase (bcrypt)
- ✅ RLS policies enforce user data isolation
- ✅ Session tokens in secure cookies
- ✅ Email/password authentication
- ✅ User can only see own data

**Production Note:** Email confirmation should be enabled for production accounts.

---

## 📞 Need Help?

1. Check browser console for `[v0]` logs
2. Read `TROUBLESHOOTING.md`
3. Verify Supabase settings
4. Check environment variables
5. Review the appropriate documentation guide above

---

## 📁 Key Files

```
/lib/auth-context.tsx          - Authentication logic
/app/login/page.tsx             - Login form
/app/signup/page.tsx            - Signup form
/app/profile/page.tsx           - User profile & history
/app/api/quiz-results/route.ts  - Quiz API endpoints
/scripts/01-create-schema.sql   - Database schema
/scripts/02-fix-rls-policies.sql - Security policies
```

---

## 🎯 Architecture

```
Client (Browser)
    ↓ (login/signup)
Auth Context (Supabase SDK)
    ↓ (authenticate)
Supabase Cloud (Auth + Database)
    ↓ (session token)
Browser Cookies
    ↓ (with API requests)
API Routes
    ↓ (check auth)
Database (with RLS)
```

---

## ✨ Features Working

- ✅ User registration (signup)
- ✅ User authentication (login)
- ✅ Session persistence
- ✅ Quiz results storage
- ✅ User profile page
- ✅ Quiz history
- ✅ Delete results
- ✅ Mobile responsive

---

**Start with `GETTING_STARTED_AUTH.md` for the full walkthrough!**
