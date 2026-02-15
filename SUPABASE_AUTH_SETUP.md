# Supabase Authentication Setup Guide for MonOrienta

## Overview
This guide helps you configure Supabase Authentication for the MonOrienta application. Follow these steps to enable Email/Password authentication and disable email confirmation for prototype development.

## Steps to Configure Supabase Auth

### 1. Enable Email/Password Provider

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project: `v0-student-orientation-prototype`
3. Navigate to **Authentication** > **Providers**
4. Find **Email** provider
5. Toggle it **ON** (if not already enabled)
6. Ensure **Email/Password** is the selected method

### 2. Disable Email Confirmation (for prototype)

1. In **Authentication** settings, go to **Auth Providers** > **Email**
2. Look for **Confirm email** option
3. **Toggle OFF** the email confirmation requirement
4. Click **Save**

Alternatively, in **Authentication** > **Policies**:
- Find the email confirmation setting
- Set it to **Allow signup with any email**

### 3. Configure Auth Settings

1. Go to **Authentication** > **URL Configuration**
2. Add your redirect URLs:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
   - Callback: `http://localhost:3000/auth/callback`

### 4. Verify Database Schema

The database schema has been created with:
- `user_profiles` table (primary key `id` references `auth.users.id`)
- `orientation_responses` table
- `quiz_results` table
- Row Level Security (RLS) policies that allow users to access only their own data

### 5. Test Authentication

#### Test Signup:
```
Email: test@example.com
Password: password123
Full Name: Test User
```

#### Test Login:
```
Email: test@example.com
Password: password123
```

## Environment Variables

Ensure these are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Error Messages

The app provides clear error messages:
- **"Account not found"** - User doesn't exist
- **"Wrong password"** - Incorrect credentials
- **"Email ou mot de passe incorrect"** - Generic invalid credentials
- **"Le nom complet est requis"** - Missing full name on signup
- **"Le mot de passe doit contenir au moins 6 caractères"** - Password too short

## Debugging

Check browser console for debug logs starting with `[v0]` to troubleshoot:
- `[v0] Auth initialization error` - Session initialization failed
- `[v0] Signup auth error` - Signup issue
- `[v0] Login auth error` - Login issue
- `[v0] Profile creation error` - Profile insert failed

## Mobile & Desktop Support

The authentication works on both:
- **Desktop**: Full form validation and error display
- **Mobile**: Responsive design with touch-optimized buttons

## Testing Flow

1. **Desktop**: Visit `http://localhost:3000/login` → Sign up → Complete orientation → View profile
2. **Mobile**: Test on mobile browser or use device emulation (DevTools)

## Database Access

- Users can only see their own profile data
- Users can only see their own quiz results
- Users can only see their own orientation responses
- All data is secured with Row Level Security

## Troubleshooting

If signup fails:
1. Check that Email/Password provider is enabled
2. Verify email confirmation is disabled
3. Check console for `[v0]` debug messages
4. Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set

If login fails:
1. Verify email exists in Supabase Auth
2. Check password is correct
3. See console debug messages for specific error
4. Ensure RLS policies allow select on user_profiles table

## Security Notes for Production

When moving to production:
- Enable email confirmation
- Implement rate limiting
- Add password strength requirements
- Enable two-factor authentication
- Review and strengthen RLS policies
- Use HTTPS only
- Implement audit logging
