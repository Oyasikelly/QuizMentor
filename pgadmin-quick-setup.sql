-- QuizMentor Database Setup for pgAdmin
-- Run this script in pgAdmin Query Tool

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
DO $$ BEGIN
    CREATE TYPE organization_type AS ENUM ('university', 'school', 'company', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE unit_type AS ENUM ('department', 'faculty', 'school', 'class', 'section', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer', 'essay', 'fill_in_blank');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quiz_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  address TEXT,
  domain TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  logo_url TEXT,
  phone TEXT,
  slug TEXT UNIQUE NOT NULL,
  subscription_plan TEXT DEFAULT 'basic',
  type organization_type NOT NULL
);

-- Create organizational_units table
CREATE TABLE IF NOT EXISTS organizational_units (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type unit_type NOT NULL,
  description TEXT,
  parent_id TEXT REFERENCES organizational_units(id),
  head_id TEXT,
  academic_year TEXT,
  level TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, name, type)
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  unit_id TEXT REFERENCES organizational_units(id),
  reset_token TEXT,
  reset_token_expiry TIMESTAMP WITH TIME ZONE,
  name TEXT,
  email_verified BOOLEAN DEFAULT false
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  class_year TEXT,
  academic_level TEXT,
  phone_number TEXT,
  UNIQUE(user_id, student_id)
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL,
  department TEXT,
  institution TEXT,
  subjects_taught TEXT[]
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  unit_id TEXT REFERENCES organizational_units(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  status quiz_status DEFAULT 'draft',
  time_limit INTEGER,
  passing_score INTEGER,
  total_points INTEGER,
  is_randomized BOOLEAN DEFAULT false,
  show_results BOOLEAN DEFAULT true,
  allow_retake BOOLEAN DEFAULT false,
  max_attempts INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL,
  points INTEGER DEFAULT 1,
  order_index INTEGER,
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  total_points INTEGER,
  is_passed BOOLEAN,
  time_taken INTEGER
);

-- Create quiz_answers table
CREATE TABLE IF NOT EXISTS quiz_answers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  attempt_id TEXT NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  student_answer TEXT,
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create manual_grades table
CREATE TABLE IF NOT EXISTS manual_grades (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  attempt_id TEXT NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grade INTEGER NOT NULL,
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create question_bank table
CREATE TABLE IF NOT EXISTS question_bank (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL,
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  difficulty_level INTEGER DEFAULT 1,
  tags TEXT[],
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizational_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Students can view their own profile" ON students;
CREATE POLICY "Students can view their own profile" ON students
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Teachers can view their own profile" ON teachers;
CREATE POLICY "Teachers can view their own profile" ON teachers
  FOR SELECT USING (user_id = auth.uid());

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (id, email, name, role, organization_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::user_role,
    'fupre-org'
  );
  
  -- Create student or teacher profile based on role
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO public.students (user_id, student_id)
    VALUES (NEW.id, NEW.id::text);
  ELSIF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'teacher' THEN
    INSERT INTO public.teachers (user_id, employee_id)
    VALUES (NEW.id, NEW.id::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subjects_updated_at ON subjects;
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_quizzes_updated_at ON quizzes;
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_question_bank_updated_at ON question_bank;
CREATE TRIGGER update_question_bank_updated_at BEFORE UPDATE ON question_bank
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default organization
INSERT INTO organizations (id, name, slug, type) 
VALUES ('fupre-org', 'Federal University of Petroleum Resources', 'fupre', 'university')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_quizzes_teacher_id ON quizzes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_organization_id ON quizzes(organization_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student_id ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_question_bank_organization_id ON question_bank(organization_id);

-- Verify setup
SELECT 'Database setup completed successfully!' as status; 