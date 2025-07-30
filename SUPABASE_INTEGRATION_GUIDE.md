# 🚀 QuizMentor Supabase Integration Guide

## 📋 Overview

This guide will help you complete the Supabase integration for your QuizMentor application. The integration includes:

- ✅ **Authentication System** - Email/password with email verification
- ✅ **Database Setup** - Complete schema with Row Level Security
- ✅ **User Management** - Role-based access control
- ✅ **Profile Completion** - Automatic profile creation and completion checks

## 🎯 Phase 1: Environment Setup

### Step 1: Create Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Configuration (if using separate database)
DATABASE_URL=your_database_connection_string
```

### Step 2: Get Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** > **API**
4. Copy the **Project URL** and **anon public** key
5. Replace the placeholder values in your `.env.local` file

## 🎯 Phase 2: Database Setup

### Step 1: Run the Database Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase-setup.sql`
4. Paste and run the SQL script

This will create:

- ✅ All necessary tables (users, students, teachers, quizzes, etc.)
- ✅ Row Level Security policies
- ✅ Automatic user profile creation triggers
- ✅ Default organization setup

### Step 2: Verify Database Setup

After running the SQL script, you should see:

- ✅ All tables created successfully
- ✅ RLS policies enabled
- ✅ Triggers created
- ✅ Default organization inserted

## 🎯 Phase 3: Authentication Configuration

### Step 1: Configure Supabase Auth Settings

In your Supabase Dashboard:

1. Go to **Authentication** > **Settings**
2. Configure the following:

**Site URL:**

```
http://localhost:3000
```

**Redirect URLs:**

```
http://localhost:3000/auth/callback
http://localhost:3000/login
http://localhost:3000/register
```

### Step 2: Email Templates (Optional)

1. Go to **Authentication** > **Email Templates**
2. Customize the email templates as needed
3. Test the email confirmation flow

## 🎯 Phase 4: Testing the Integration

### Step 1: Test Registration

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/register`
3. Create a new account with:
   - **Name**: Test User
   - **Email**: your-email@example.com
   - **Password**: password123
   - **Role**: Student or Teacher

### Step 2: Test Email Verification

1. Check your email for the confirmation link
2. Click the confirmation link
3. You should be redirected to the email verification callback page
4. After verification, you'll be redirected to complete your profile

### Step 3: Test Login

1. Navigate to `http://localhost:3000/login`
2. Sign in with your registered credentials
3. You should be redirected to your dashboard

## 🎯 Phase 5: Profile Completion

### Student Profile Requirements:

- ✅ Academic Level
- ✅ Class Year
- ✅ Phone Number

### Teacher Profile Requirements:

- ✅ Department
- ✅ Institution

## 🔧 Troubleshooting

### Common Issues:

#### 1. "Missing Supabase environment variables"

**Solution:**

- Ensure `.env.local` file exists in project root
- Restart development server after adding environment variables
- Check that variable names match exactly

#### 2. "User profile not found"

**Solution:**

- Verify the database trigger is working
- Check that the `handle_new_user()` function was created
- Ensure the default organization exists

#### 3. "Email confirmation not working"

**Solution:**

- Check redirect URLs in Supabase settings
- Verify the callback route is accessible
- Test email templates in Supabase dashboard

#### 4. "Authentication redirect issues"

**Solution:**

- Verify site URL is configured correctly
- Check that all redirect URLs are added
- Ensure callback page is working

## 🚀 Production Deployment

### Step 1: Update Supabase Settings

1. Go to **Authentication** > **Settings**
2. Update **Site URL** to your production domain
3. Add production redirect URLs:
   ```
   https://yourdomain.com/auth/callback
   https://yourdomain.com/login
   https://yourdomain.com/register
   ```

### Step 2: Environment Variables

Set up environment variables in your hosting platform:

- Vercel: Add to project settings
- Railway: Add to environment variables
- Render: Add to environment variables

### Step 3: Database Connection

Ensure your production database is properly configured and accessible.

## 📊 What's Been Implemented

### ✅ Authentication System

- [x] Supabase Auth integration
- [x] Email verification flow
- [x] Role-based registration
- [x] Session management
- [x] Automatic logout

### ✅ Database Integration

- [x] Complete schema setup
- [x] Row Level Security
- [x] Automatic user profile creation
- [x] Profile completion checks
- [x] Organization-based access control

### ✅ User Experience

- [x] Smooth registration flow
- [x] Email confirmation handling
- [x] Profile completion redirects
- [x] Error handling and notifications
- [x] Loading states

### ✅ Security Features

- [x] Email verification required
- [x] Role-based access control
- [x] Row Level Security policies
- [x] Secure session management
- [x] Input validation

## 🎉 Next Steps

After completing this integration:

1. **Test all flows** thoroughly
2. **Add more features** like password reset
3. **Implement social login** (Google, GitHub)
4. **Add two-factor authentication**
5. **Set up monitoring** and analytics

## 📞 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify Supabase dashboard settings
3. Test database connections
4. Review the troubleshooting section above

---

**🎯 Your QuizMentor application now has a complete, secure authentication system powered by Supabase!**
