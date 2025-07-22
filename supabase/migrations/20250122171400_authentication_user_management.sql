-- Location: supabase/migrations/20250122171400_authentication_user_management.sql
-- Authentication & User Management Module

-- 1. Types and Core Tables
CREATE TYPE public.user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE public.subject_type AS ENUM ('mathematics', 'physics', 'chemistry', 'biology', 'english', 'history');

-- Critical intermediary table for auth relationships
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role,
    status public.user_status DEFAULT 'active'::public.user_status,
    avatar_url TEXT,
    school_name TEXT,
    grade_level INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table for course management
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject_type public.subject_type NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Study sessions tracking
CREATE TABLE public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL, -- 'self_study', 'tutoring', 'group'
    duration_minutes INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Quiz attempts tracking
CREATE TABLE public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    quiz_title TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    correct_answers INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Essential Indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_study_sessions_student_id ON public.study_sessions(student_id);
CREATE INDEX idx_study_sessions_subject_id ON public.study_sessions(subject_id);
CREATE INDEX idx_quiz_attempts_student_id ON public.quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_subject_id ON public.quiz_attempts(subject_id);

-- 3. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 4. Helper Functions for RLS
CREATE OR REPLACE FUNCTION public.is_teacher_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('teacher', 'admin')
    AND up.status = 'active'
)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role = 'admin'
    AND up.status = 'active'
)
$$;

CREATE OR REPLACE FUNCTION public.owns_study_session(session_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.study_sessions ss
    WHERE ss.id = session_uuid 
    AND ss.student_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.owns_quiz_attempt(attempt_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.quiz_attempts qa
    WHERE qa.id = attempt_uuid 
    AND qa.student_id = auth.uid()
)
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role, school_name, grade_level)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role),
    NEW.raw_user_meta_data->>'school_name',
    COALESCE((NEW.raw_user_meta_data->>'grade_level')::integer, NULL)
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Trigger for updated_at on user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 5. RLS Policies
-- User profiles: users can view their own profile, teachers can view student profiles
CREATE POLICY "users_own_profile" 
ON public.user_profiles 
FOR ALL
TO authenticated
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

CREATE POLICY "teachers_view_student_profiles" 
ON public.user_profiles 
FOR SELECT
TO authenticated
USING (public.is_teacher_or_admin() AND role = 'student');

-- Subjects: public read access for authenticated users, admin/teacher write access
CREATE POLICY "authenticated_users_view_subjects" 
ON public.subjects 
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "teachers_manage_subjects" 
ON public.subjects 
FOR ALL
TO authenticated
USING (public.is_teacher_or_admin()) 
WITH CHECK (public.is_teacher_or_admin());

-- Study sessions: students own their sessions, teachers can view all
CREATE POLICY "students_manage_own_sessions" 
ON public.study_sessions 
FOR ALL
TO authenticated
USING (public.owns_study_session(id) OR public.is_teacher_or_admin()) 
WITH CHECK (student_id = auth.uid());

-- Quiz attempts: students own their attempts, teachers can view all
CREATE POLICY "students_manage_own_quiz_attempts" 
ON public.quiz_attempts 
FOR ALL
TO authenticated
USING (public.owns_quiz_attempt(id) OR public.is_teacher_or_admin()) 
WITH CHECK (student_id = auth.uid());

-- 6. Initial Data Setup
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    teacher_uuid UUID := gen_random_uuid();
    student1_uuid UUID := gen_random_uuid();
    student2_uuid UUID := gen_random_uuid();
    math_subject_id UUID := gen_random_uuid();
    physics_subject_id UUID := gen_random_uuid();
    chemistry_subject_id UUID := gen_random_uuid();
    biology_subject_id UUID := gen_random_uuid();
    english_subject_id UUID := gen_random_uuid();
    history_subject_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@eduplatform.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Platform Administrator", "role": "admin", "school_name": "EduPlatform Central"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (teacher_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'teacher@school.edu', crypt('teacher123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Ms. Johnson", "role": "teacher", "school_name": "Lincoln High School"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'alex.chen@student.edu', crypt('student123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Alex Chen", "role": "student", "school_name": "Lincoln High School", "grade_level": "11"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'emma.wilson@student.edu', crypt('student123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Emma Wilson", "role": "student", "school_name": "Lincoln High School", "grade_level": "11"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create subjects
    INSERT INTO public.subjects (id, name, subject_type, description) VALUES
        (math_subject_id, 'Mathematics', 'mathematics', 'Algebra, Geometry, and Calculus'),
        (physics_subject_id, 'Physics', 'physics', 'Mechanics, Thermodynamics, and Electromagnetism'),
        (chemistry_subject_id, 'Chemistry', 'chemistry', 'Organic, Inorganic, and Physical Chemistry'),
        (biology_subject_id, 'Biology', 'biology', 'Cell Biology, Genetics, and Ecology'),
        (english_subject_id, 'English Literature', 'english', 'Literature Analysis and Writing'),
        (history_subject_id, 'World History', 'history', 'Ancient to Modern World History');

    -- Create sample study sessions
    INSERT INTO public.study_sessions (student_id, subject_id, session_type, duration_minutes, completed_at) VALUES
        (student1_uuid, math_subject_id, 'self_study', 45, now() - interval '2 hours'),
        (student1_uuid, physics_subject_id, 'tutoring', 60, now() - interval '1 day'),
        (student2_uuid, chemistry_subject_id, 'group', 90, now() - interval '3 hours'),
        (student2_uuid, math_subject_id, 'self_study', 30, now() - interval '4 hours');

    -- Create sample quiz attempts
    INSERT INTO public.quiz_attempts (student_id, subject_id, quiz_title, score, correct_answers, total_questions, time_spent_minutes) VALUES
        (student1_uuid, math_subject_id, 'Quadratic Equations Quiz', 85, 17, 20, 25),
        (student1_uuid, physics_subject_id, 'Newtons Laws Quiz', 72, 14, 20, 18),
        (student2_uuid, chemistry_subject_id, 'Periodic Table Quiz', 91, 18, 20, 22),
        (student2_uuid, math_subject_id, 'Linear Functions Quiz', 88, 22, 25, 30);

END $$;

-- 7. Cleanup function for test data
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get test user IDs
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email IN ('admin@eduplatform.com', 'teacher@school.edu', 'alex.chen@student.edu', 'emma.wilson@student.edu');

    -- Delete in dependency order
    DELETE FROM public.quiz_attempts WHERE student_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.study_sessions WHERE student_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.subjects;
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
    
    RAISE NOTICE 'Test data cleanup completed successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;