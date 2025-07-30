# 🚀 QuizMentor Supabase + pgAdmin Integration Guide

## 📋 Overview

This guide is specifically for users who are familiar with pgAdmin and want to integrate Supabase authentication with their QuizMentor application.

## 🎯 Option 1: Use Supabase's Built-in PostgreSQL (Recommended)

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Choose your organization
4. Enter project details:
   - **Name**: QuizMentor
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click **"Create new project"**

### Step 2: Get Database Connection Details

1. In your Supabase project dashboard
2. Go to **Settings** > **Database**
3. Copy the following details:
   - **Host**: `db.your-project-ref.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: (the one you set during creation)

### Step 3: Connect pgAdmin to Supabase Database

1. Open pgAdmin
2. Right-click on **Servers** > **Register** > **Server**
3. In the **General** tab:
   - **Name**: QuizMentor Supabase
4. In the **Connection** tab:
   - **Host name/address**: `db.your-project-ref.supabase.co`
   - **Port**: `5432`
   - **Maintenance database**: `postgres`
   - **Username**: `postgres`
   - **Password**: (your database password)
5. Click **Save**

### Step 4: Run the Database Schema

1. In pgAdmin, connect to your Supabase database
2. Right-click on the **postgres** database
3. Select **Query Tool**
4. Copy the entire contents of `supabase-setup.sql`
5. Paste and execute the script

### Step 5: Verify Setup in pgAdmin

After running the script, you should see:

**Tables Created:**

- ✅ `organizations`
- ✅ `organizational_units`
- ✅ `users`
- ✅ `students`
- ✅ `teachers`
- ✅ `subjects`
- ✅ `quizzes`
- ✅ `questions`
- ✅ `quiz_attempts`
- ✅ `quiz_answers`
- ✅ `manual_grades`
- ✅ `chat_sessions`
- ✅ `chat_messages`
- ✅ `question_bank`

**Functions Created:**

- ✅ `handle_new_user()`
- ✅ `update_updated_at_column()`

**Triggers Created:**

- ✅ `on_auth_user_created`
- ✅ Various `update_*_updated_at` triggers

**Policies Created:**

- ✅ Row Level Security policies for all tables

### Step 6: Set Up Environment Variables

Create `.env.local` in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Database Configuration (for pgAdmin access)
DATABASE_URL=postgresql://postgres:your_password@db.your-project-ref.supabase.co:5432/postgres
```

### Step 7: Configure Supabase Authentication

1. In Supabase Dashboard, go to **Authentication** > **Settings**
2. Set **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/login
   http://localhost:3000/register
   ```

## 🎯 Option 2: Connect to Your Existing PostgreSQL Database

If you prefer to keep using your existing database:

### Step 1: Enable Supabase Auth on Your Database

1. In your existing PostgreSQL database, create the auth schema:

   ```sql
   CREATE SCHEMA IF NOT EXISTS auth;
   ```

2. Create the auth.users table:
   ```sql
   CREATE TABLE auth.users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     encrypted_password TEXT,
     email_confirmed_at TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Step 2: Update Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Your existing database
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
```

## 🔧 Testing the Setup

### Step 1: Test Database Connection

1. In pgAdmin, try to query the `users` table:

   ```sql
   SELECT * FROM users LIMIT 5;
   ```

2. Check if the default organization exists:
   ```sql
   SELECT * FROM organizations WHERE id = 'fupre-org';
   ```

### Step 2: Test Registration Flow

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/register`
3. Create a test account
4. Check pgAdmin to see if the user was created:
   ```sql
   SELECT u.*, s.*, t.*
   FROM users u
   LEFT JOIN students s ON u.id = s.user_id
   LEFT JOIN teachers t ON u.id = t.user_id
   WHERE u.email = 'your-test-email@example.com';
   ```

## 🛠️ Troubleshooting with pgAdmin

### Issue 1: Connection Failed

**Solution:**

- Check if your IP is whitelisted in Supabase
- Verify connection details
- Ensure SSL is enabled

### Issue 2: Tables Not Created

**Solution:**

- Run the SQL script in smaller chunks
- Check for syntax errors
- Verify you have the necessary permissions

### Issue 3: User Profile Not Created

**Solution:**

- Check if the trigger function exists:
  ```sql
  SELECT * FROM information_schema.triggers
  WHERE trigger_name = 'on_auth_user_created';
  ```
- Verify the trigger is enabled:
  ```sql
  SELECT * FROM information_schema.triggers
  WHERE event_object_table = 'users';
  ```

### Issue 4: RLS Policies Not Working

**Solution:**

- Check if RLS is enabled:
  ```sql
  SELECT schemaname, tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = 'public';
  ```
- Verify policies exist:
  ```sql
  SELECT * FROM pg_policies WHERE schemaname = 'public';
  ```

## 📊 Useful pgAdmin Queries

### Check User Registration

```sql
SELECT
  u.id,
  u.email,
  u.name,
  u.role,
  u.created_at,
  s.academic_level,
  s.class_year,
  t.department,
  t.institution
FROM users u
LEFT JOIN students s ON u.id = s.user_id
LEFT JOIN teachers t ON u.id = t.user_id
ORDER BY u.created_at DESC;
```

### Check Profile Completion

```sql
SELECT
  u.email,
  u.role,
  CASE
    WHEN u.role = 'student' THEN
      CASE WHEN s.academic_level IS NOT NULL
           AND s.class_year IS NOT NULL
           AND s.phone_number IS NOT NULL
           THEN 'Complete'
           ELSE 'Incomplete'
      END
    WHEN u.role = 'teacher' THEN
      CASE WHEN t.department IS NOT NULL
           AND t.institution IS NOT NULL
           THEN 'Complete'
           ELSE 'Incomplete'
      END
    ELSE 'Unknown'
  END as profile_status
FROM users u
LEFT JOIN students s ON u.id = s.user_id
LEFT JOIN teachers t ON u.id = t.user_id;
```

### Monitor Authentication Events

```sql
SELECT
  u.email,
  u.created_at as registered_at,
  u.email_confirmed_at,
  CASE WHEN u.email_confirmed_at IS NOT NULL
       THEN 'Verified'
       ELSE 'Pending'
  END as email_status
FROM users u
ORDER BY u.created_at DESC;
```

## 🎉 Next Steps

After successful setup:

1. **Test the complete authentication flow**
2. **Monitor user registrations in pgAdmin**
3. **Set up database backups**
4. **Configure production environment**
5. **Add monitoring and logging**

---

**🎯 You now have a complete Supabase + pgAdmin setup for QuizMentor!**
