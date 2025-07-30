# Supabase Authentication Setup Guide

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be set up (this may take a few minutes)

## 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Configuration (if using separate database)
DATABASE_URL=your_database_connection_string
```

## 4. Set Up Database Tables

In your Supabase dashboard, go to **SQL Editor** and run the following SQL to create the users table:

```sql
-- Create users table to store additional user information
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
  organization_id TEXT DEFAULT 'fupre-org',
  academic_level TEXT,
  class_year TEXT,
  phone_number TEXT,
  department TEXT,
  institution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 5. Configure Authentication Settings

In your Supabase dashboard:

1. Go to **Authentication** > **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add these URLs:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/login`
     - `http://localhost:3000/register`
   - **Email Templates**: Customize as needed

## 6. Email Confirmation Flow

The application now supports automatic email confirmation handling:

1. **User Registration**: User registers with email/password
2. **Email Sent**: Supabase sends confirmation email
3. **Email Clicked**: User clicks confirmation link
4. **Callback Processing**: App processes the callback at `/auth/callback`
5. **Profile Check**: App checks if profile is complete
6. **Redirect**:
   - If profile incomplete → `/student/complete-profile` or `/teacher/complete-profile`
   - If profile complete → `/student` or `/teacher`

## 7. Profile Completion Logic

The app automatically checks profile completion:

**For Students:**

- ✅ academicLevel
- ✅ classYear
- ✅ phoneNumber

**For Teachers:**

- ✅ department
- ✅ institution

## 8. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/register`
3. Create a new account
4. Check your email for confirmation link
5. Click the confirmation link
6. You should be redirected to complete your profile

## 9. Production Deployment

For production deployment:

1. Update the **Site URL** in Supabase to your production domain
2. Add your production domain to **Redirect URLs**:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com/login`
   - `https://yourdomain.com/register`
3. Set up your environment variables in your hosting platform
4. Update the middleware configuration if needed

## 10. Profile Completion Flow

When users log in or confirm their email:

1. **Profile Check**: App checks if required fields are filled
2. **Toast Notification**: Shows what fields are missing
3. **Automatic Redirect**: Redirects to appropriate complete-profile page
4. **Dashboard Access**: Only after profile is complete

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**

   - Make sure your `.env.local` file exists and has the correct values
   - Restart your development server after adding environment variables

2. **"User not found" errors**

   - Check that the users table was created correctly
   - Verify the trigger function is working

3. **Authentication redirect issues**

   - Check your redirect URLs in Supabase settings
   - Ensure your site URL is configured correctly

4. **Email confirmation not working**

   - Verify the callback URL is added to Supabase redirect URLs
   - Check that the `/auth/callback` route is accessible

5. **Profile completion not working**
   - Ensure the users table has the required fields
   - Check that the profile completion logic is working

### Getting Help:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
